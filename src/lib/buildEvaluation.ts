import type { Evaluation, EvaluationMeta, EvaluationIdentity, EvaluationAssessment, EvidenceLog, FieldResponse, AIHallucinationCheck } from '@/lib/schema'
import type { DraftState } from '@/context/FormStateContext'

const AI_CHECK_OPTIONS_TO_ENUM: Record<string, AIHallucinationCheck> = {
  'AI was 100% correct for this section': 'ai_100_correct',
  'AI made minor errors (1-2 fields wrong)': 'ai_minor_errors',
  'AI made significant errors (3+ fields wrong or hallucinated capabilities)': 'ai_significant_errors',
  "AI completely hallucinated capabilities that don't exist": 'ai_completely_hallucinated',
  'AI refused to answer / could not assess': 'ai_refused',
  'AI was not used for this section': 'ai_not_used',
}

function toIsoDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function extractValue(fr: FieldResponse | undefined): string | string[] | number | null {
  if (!fr) return null
  return fr.value ?? null
}

function extractString(fr: FieldResponse | undefined): string {
  const v = extractValue(fr)
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v.join('; ')
  if (typeof v === 'number') return String(v)
  return ''
}

function extractStringArray(fr: FieldResponse | undefined): string[] {
  const v = extractValue(fr)
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string')
  if (typeof v === 'string' && v) return [v]
  return []
}

export function buildEvaluation(draft: DraftState, evaluatorUsername: string): Evaluation {
  const meta: EvaluationMeta = {
    schema_version: '1.0',
    platform_slug: draft.meta?.platform_slug ?? 'unknown',
    platform_name: draft.meta?.platform_name ?? 'Unknown Platform',
    evaluator: evaluatorUsername,
    evaluation_date: toIsoDate(),
    last_verified_date: toIsoDate(),
    cohort: draft.meta?.cohort ?? 'AGT3510',
    total_hours_spent: typeof draft.meta?.total_hours_spent === 'number' ? draft.meta.total_hours_spent : 0,
  }

  const idSec = draft.sections?.identity ?? {}
  const identity: EvaluationIdentity = {
    version_module_evaluated: extractString(idSec.version_module_evaluated) || 'Not specified',
    company_developer: extractString(idSec.company_developer) || '',
    country_of_origin: extractString(idSec.country_of_origin) || '',
    year_founded: extractString(idSec.year_founded) || '',
    platform_type: extractStringArray(idSec.platform_type),
    primary_agricultural_focus: extractStringArray(idSec.primary_agricultural_focus),
    website_url: extractString(idSec.website_url) || '',
    last_updated_version: extractString(idSec.last_updated_version) || '',
  }

  const sections: Evaluation['sections'] = {}
  for (const [skey, sdata] of Object.entries(draft.sections ?? {})) {
    if (!sdata || typeof sdata !== 'object') continue
    sections[skey] = { ...sdata }
  }

  const ai_checks: Evaluation['ai_checks'] = {}
  for (const [skey, strVal] of Object.entries(draft.ai_checks ?? {})) {
    if (strVal && AI_CHECK_OPTIONS_TO_ENUM[strVal] != null)
      ai_checks[skey] = AI_CHECK_OPTIONS_TO_ENUM[strVal]
  }

  const a = draft.assessment ?? {}
  const assessment: EvaluationAssessment = {
    strongest_capability: (a.strongest_capability as string) ?? '',
    strongest_capability_justification: (a.strongest_capability_justification as string) ?? '',
    weakest_capability: (a.weakest_capability as string) ?? '',
    weakest_capability_justification: (a.weakest_capability_justification as string) ?? '',
    best_suited_for: Array.isArray(a.best_suited_for) ? a.best_suited_for : [],
    worst_suited_for: (a.worst_suited_for as string) ?? '',
    unique_differentiator: (a.unique_differentiator as string) ?? '',
    recommendation: (a.recommendation as string) ?? '',
    ai_claims_total: typeof a.ai_claims_total === 'number' ? a.ai_claims_total : 0,
    ai_claims_correct: typeof a.ai_claims_correct === 'number' ? a.ai_claims_correct : 0,
    ai_claims_incorrect: typeof a.ai_claims_incorrect === 'number' ? a.ai_claims_incorrect : 0,
    ai_claims_unverifiable: typeof a.ai_claims_unverifiable === 'number' ? a.ai_claims_unverifiable : 0,
    ai_notable_error: (a.ai_notable_error as string) ?? '',
  }

  const evidence_log: EvidenceLog = {
    source_types_used: Array.isArray(draft.evidence_log?.source_types_used) ? draft.evidence_log.source_types_used : [],
    official_doc_urls: Array.isArray(draft.evidence_log?.official_doc_urls) ? draft.evidence_log.official_doc_urls : [],
    third_party_urls: Array.isArray(draft.evidence_log?.third_party_urls) ? draft.evidence_log.third_party_urls : [],
    hands_on_notes: typeof draft.evidence_log?.hands_on_notes === 'string' ? draft.evidence_log.hands_on_notes : '',
  }

  return {
    meta,
    identity,
    sections,
    ai_checks,
    assessment,
    evidence_log,
  }
}
