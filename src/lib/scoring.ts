import type { FieldResponse } from '@/lib/schema'

export interface SectionScore {
  evidence_weighted_score: number
  answered_count: number
  applicable_count: number
}

const EVIDENCE_WEIGHT: Record<string, number> = {
  hands_on_verified: 1,
  documentation_verified: 0.9,
  third_party_verified: 0.8,
  vendor_claimed: 0.5,
  unknown: 0.2,
  not_applicable: 0,
}

function hasValue(fr: FieldResponse): boolean {
  const v = fr.value
  if (v == null) return false
  if (Array.isArray(v)) return v.length > 0
  if (typeof v === 'string') return v.trim().length > 0
  return true
}

export function calculateSectionScore(section: Record<string, FieldResponse>): SectionScore {
  const entries = Object.entries(section).filter(([, fr]) => fr && typeof fr === 'object')
  const applicable = entries.filter(([, fr]) => fr.evidence_tag !== 'not_applicable')
  const answered = applicable.filter(([, fr]) => hasValue(fr))
  if (applicable.length === 0) {
    return { evidence_weighted_score: 0, answered_count: 0, applicable_count: 0 }
  }
  let weighted = 0
  for (const [, fr] of answered) {
    const w = EVIDENCE_WEIGHT[fr.evidence_tag] ?? 0.2
    weighted += w
  }
  const evidence_weighted_score = applicable.length > 0 ? weighted / applicable.length : 0
  return {
    evidence_weighted_score,
    answered_count: answered.length,
    applicable_count: applicable.length,
  }
}
