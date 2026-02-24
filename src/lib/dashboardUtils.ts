/**
 * Dashboard data extraction utilities.
 * Derive display and filter values from evaluation JSON.
 */
import type { Evaluation, FieldResponse } from '@/lib/schema'
import { calculateSectionScore } from '@/lib/scoring'

export const ALL_SCORED_SECTIONS = [
  'ingestion',
  'processing_2a',
  'processing_2b',
  'export',
  'integration',
  'governance',
  'access',
  'pricing',
  'usability',
] as const

/** 6 axes for radar: Ingestion, Processing (2a+2b), Export, Integration, Governance, Usability */
export const RADAR_SECTION_KEYS = ['ingestion', 'processing_2a', 'processing_2b', 'export', 'integration', 'governance', 'usability'] as const

export interface PlatformRecord {
  slug: string
  name: string
  company: string
  category: string
  country: string
}

function getSectionValue(e: Evaluation, sectionKey: string, fieldKey: string): string | string[] | number | null | undefined {
  const section = e.sections?.[sectionKey]
  const fr: FieldResponse | undefined = section?.[fieldKey]
  return fr?.value ?? undefined
}

function getSectionString(e: Evaluation, sectionKey: string, fieldKey: string): string {
  const v = getSectionValue(e, sectionKey, fieldKey)
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v.join(', ')
  if (typeof v === 'number') return String(v)
  return ''
}

function getSectionStringArray(e: Evaluation, sectionKey: string, fieldKey: string): string[] {
  const v = getSectionValue(e, sectionKey, fieldKey)
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string')
  if (typeof v === 'string' && v) return [v]
  return []
}

export type PriceBadge = 'FREE' | 'FREEMIUM' | '$' | '$$$' | null

export function getPriceBadge(e: Evaluation): PriceBadge {
  const models = getSectionStringArray(e, 'pricing', 'pricing_model')
  const freeTier = getSectionString(e, 'pricing', 'free_tier_available').toLowerCase()
  if (models.some((m) => m.toLowerCase().includes('free') && !m.toLowerCase().includes('freemium')) || freeTier === 'yes') return 'FREE'
  if (models.some((m) => m.toLowerCase().includes('freemium')) || freeTier.includes('partial')) return 'FREEMIUM'
  if (models.some((m) => /per-acre|per-head|flat subscription|per-seat/i.test(m))) return '$'
  if (models.some((m) => /custom|enterprise/i.test(m))) return '$$$'
  return null
}

export type HardwareDependency = 'independent' | 'enhanced' | 'locked' | 'unknown'

export function getHardwareDependency(e: Evaluation): HardwareDependency {
  const v = getSectionString(e, 'integration', 'hardware_dependency').toLowerCase()
  if (/software-independent|all core features work without/i.test(v)) return 'independent'
  if (/enhanced by proprietary|partially locked/i.test(v)) return 'enhanced'
  if (/fully locked|cannot meaningfully use/i.test(v)) return 'locked'
  return 'unknown'
}

export function getEvidenceQuality(e: Evaluation): { verified: number; total: number; percent: number } {
  let verified = 0
  let total = 0
  for (const section of Object.values(e.sections ?? {})) {
    if (!section || typeof section !== 'object') continue
    for (const fr of Object.values(section)) {
      if (!fr || fr.evidence_tag === 'not_applicable') continue
      total++
      if (fr.evidence_tag === 'hands_on_verified' || fr.evidence_tag === 'documentation_verified') verified++
    }
  }
  const percent = total > 0 ? Math.round((verified / total) * 100) : 0
  return { verified, total, percent }
}

const AI_CHECK_CORRECT: Record<string, boolean> = {
  ai_100_correct: true,
  ai_minor_errors: true,
  ai_significant_errors: false,
  ai_completely_hallucinated: false,
  ai_refused: false,
  ai_not_used: false,
}

export function getAIAccuracyBySection(e: Evaluation): Record<string, 'correct' | 'minor' | 'major' | 'hallucinated' | 'not_used'> {
  const out: Record<string, 'correct' | 'minor' | 'major' | 'hallucinated' | 'not_used'> = {}
  for (const [section, check] of Object.entries(e.ai_checks ?? {})) {
    if (!check) continue
    if (check === 'ai_100_correct') out[section] = 'correct'
    else if (check === 'ai_minor_errors') out[section] = 'minor'
    else if (check === 'ai_significant_errors') out[section] = 'major'
    else if (check === 'ai_completely_hallucinated') out[section] = 'hallucinated'
    else out[section] = 'not_used'
  }
  return out
}

export function getOverallAIAccuracy(evaluations: Evaluation[]): {
  totalClaims: number
  correct: number
  incorrect: number
  unverifiable: number
  sectionsCorrect: number
  sectionsTotal: number
  percentSectionsCorrect: number
} {
  let totalClaims = 0
  let correct = 0
  let incorrect = 0
  let unverifiable = 0
  let sectionsCorrect = 0
  let sectionsTotal = 0
  for (const e of evaluations) {
    const a = e.assessment
    if (a) {
      totalClaims += typeof a.ai_claims_total === 'number' ? a.ai_claims_total : 0
      correct += typeof a.ai_claims_correct === 'number' ? a.ai_claims_correct : 0
      incorrect += typeof a.ai_claims_incorrect === 'number' ? a.ai_claims_incorrect : 0
      unverifiable += typeof a.ai_claims_unverifiable === 'number' ? a.ai_claims_unverifiable : 0
    }
    for (const [_, check] of Object.entries(e.ai_checks ?? {})) {
      if (!check) continue
      sectionsTotal++
      if (AI_CHECK_CORRECT[check]) sectionsCorrect++
    }
  }
  const percentSectionsCorrect = sectionsTotal > 0 ? Math.round((sectionsCorrect / sectionsTotal) * 100) : 0
  return {
    totalClaims,
    correct,
    incorrect,
    unverifiable,
    sectionsCorrect,
    sectionsTotal,
    percentSectionsCorrect,
  }
}

export interface FeatureFlags {
  shapefile: boolean | 'na'
  isoxml: boolean | 'na'
  adapt: boolean | 'na'
  publicApi: boolean | 'na'
  offline: boolean | 'na'
  batchExport: boolean | 'na'
}

export function getFeatureFlags(e: Evaluation): FeatureFlags {
  const openFormats = getSectionStringArray(e, 'ingestion', 'file_format_import_open')
  const adapt = getSectionString(e, 'integration', 'adapt_support')
  const api = getSectionString(e, 'integration', 'api_availability')
  const offline = getSectionString(e, 'access', 'offline_functionality')
  const batchExport = getSectionString(e, 'export', 'batch_export')

  const has = (arr: string[], ...keys: string[]) => arr.some((x) => keys.some((k) => x.toLowerCase().includes(k)))
  const yes = (s: string) => s && s.toLowerCase().startsWith('yes')
  const partial = (s: string) => s && (s.toLowerCase().includes('full') || s.toLowerCase().includes('partial'))

  return {
    shapefile: openFormats.length ? has(openFormats, 'shapefile', '.shp') : 'na',
    isoxml: openFormats.length ? has(openFormats, 'isoxml', 'isobus', 'iso 11783') : 'na',
    adapt: adapt ? yes(adapt) : 'na',
    publicApi: api ? api.toLowerCase().includes('public') : 'na',
    offline: offline ? partial(offline) : 'na',
    batchExport: batchExport ? batchExport.toLowerCase().includes('batch') || batchExport.toLowerCase().includes('entire farm') : 'na',
  }
}

export function getAnnualCostBroadacre(e: Evaluation): number | null {
  const v = getSectionValue(e, 'pricing', 'standardized_cost_broadacre_annual')
  if (typeof v === 'number' && v >= 0) return v
  if (typeof v === 'string') {
    const n = parseFloat(v)
    if (!Number.isNaN(n) && n >= 0) return n
  }
  return null
}

export function getAnnualCostLivestock(e: Evaluation): number | null {
  const v = getSectionValue(e, 'pricing', 'standardized_cost_livestock_annual')
  if (typeof v === 'number' && v >= 0) return v
  if (typeof v === 'string') {
    const n = parseFloat(v)
    if (!Number.isNaN(n) && n >= 0) return n
  }
  return null
}

export function getOEMCompatibility(e: Evaluation): string[] {
  return getSectionStringArray(e, 'integration', 'oem_equipment_compatibility')
}

export function getDataOwnership(e: Evaluation): string {
  return getSectionString(e, 'governance', 'data_ownership_policy')
}

export function getADTCertified(e: Evaluation): boolean {
  const v = getSectionString(e, 'governance', 'ag_data_transparent').toLowerCase()
  return v.startsWith('yes')
}

export function getCategoryForPlatform(slug: string, platforms: PlatformRecord[]): string {
  const p = platforms.find((x) => x.slug === slug)
  return p?.category ?? 'Other'
}

export function getBestSuitedFor(e: Evaluation): string[] {
  const a = e.assessment?.best_suited_for
  return Array.isArray(a) ? a : []
}

export function getOverallScore(e: Evaluation): number {
  let total = 0
  let count = 0
  for (const key of ALL_SCORED_SECTIONS) {
    const section = e.sections?.[key]
    if (!section) continue
    const score = calculateSectionScore(section)
    if (score.applicable_count > 0) {
      total += score.evidence_weighted_score
      count++
    }
  }
  return count > 0 ? Math.round((total / count) * 100) : 0
}

export function getTotalFieldsAnswered(e: Evaluation): { answered: number; total: number } {
  let answered = 0
  let total = 0
  for (const section of Object.values(e.sections ?? {})) {
    if (!section || typeof section !== 'object') continue
    for (const fr of Object.values(section)) {
      if (!fr || fr.evidence_tag === 'not_applicable') continue
      total++
      const v = fr.value
      if (v != null && (Array.isArray(v) ? v.length > 0 : typeof v === 'string' ? v.trim().length > 0 : true)) answered++
    }
  }
  return { answered, total }
}

/** Radar data: 6 axes. Processing = average of 2a + 2b. */
export function getRadarScores(e: Evaluation): { section: string; score: number }[] {
  const score = (key: string) => {
    const section = e.sections?.[key]
    const s = section ? calculateSectionScore(section) : { evidence_weighted_score: 0 }
    return Math.round(s.evidence_weighted_score * 100)
  }
  const processingScore = Math.round((score('processing_2a') + score('processing_2b')) / 2)
  return [
    { section: 'Ingestion', score: score('ingestion') },
    { section: 'Processing', score: processingScore },
    { section: 'Export', score: score('export') },
    { section: 'Integration', score: score('integration') },
    { section: 'Governance', score: score('governance') },
    { section: 'Usability', score: score('usability') },
  ]
}

/** One evaluation per platform (most recent by evaluation_date). */
export function oneEvaluationPerPlatform(evaluations: Evaluation[]): Evaluation[] {
  const bySlug = new Map<string, Evaluation>()
  for (const e of evaluations) {
    const slug = e.meta.platform_slug
    const existing = bySlug.get(slug)
    if (!existing || (e.meta.evaluation_date && existing.meta.evaluation_date && e.meta.evaluation_date > existing.meta.evaluation_date)) {
      bySlug.set(slug, e)
    }
  }
  return Array.from(bySlug.values())
}

/** Search across platform name, company, strongest justification, unique differentiator. */
export function searchMatchesEvaluation(e: Evaluation, query: string): boolean {
  if (!query.trim()) return true
  const q = query.trim().toLowerCase()
  const name = (e.meta.platform_name ?? '').toLowerCase()
  const company = (e.identity?.company_developer ?? '').toLowerCase()
  const strongest = (e.assessment?.strongest_capability_justification ?? '').toLowerCase()
  const differentiator = (e.assessment?.unique_differentiator ?? '').toLowerCase()
  return name.includes(q) || company.includes(q) || strongest.includes(q) || differentiator.includes(q)
}
