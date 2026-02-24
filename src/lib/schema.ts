/**
 * AGT3510 Evaluation Form — TypeScript schema
 * Derived from AGT3510_Evaluation_Form_Structure.md and AGT3510_Architecture_Spec.md
 */

export type EvidenceTag =
  | 'hands_on_verified'       // 🟢
  | 'documentation_verified'   // 🔵
  | 'third_party_verified'     // 🟡
  | 'vendor_claimed'           // 🟠
  | 'unknown'                  // 🔴
  | 'not_applicable'           // ⚪

export type AIHallucinationCheck =
  | 'ai_100_correct'
  | 'ai_minor_errors'
  | 'ai_significant_errors'
  | 'ai_completely_hallucinated'
  | 'ai_refused'
  | 'ai_not_used'

export interface FieldResponse {
  value: string | string[] | number | boolean | null
  evidence_tag: EvidenceTag
  source_url?: string
  notes?: string
}

export interface EvaluationMeta {
  schema_version: '1.0'
  platform_slug: string
  platform_name: string
  evaluator: string
  evaluation_date: string
  last_verified_date: string
  cohort: string
  total_hours_spent: number
}

export interface EvaluationIdentity {
  version_module_evaluated: string
  company_developer: string
  country_of_origin: string
  year_founded: string
  platform_type: string[]
  primary_agricultural_focus: string[]
  website_url: string
  last_updated_version: string
}

export interface EvaluationAssessment {
  strongest_capability: string
  strongest_capability_justification: string
  weakest_capability: string
  weakest_capability_justification: string
  best_suited_for: string[]
  worst_suited_for: string
  unique_differentiator: string
  recommendation: string
  ai_claims_total: number
  ai_claims_correct: number
  ai_claims_incorrect: number
  ai_claims_unverifiable: number
  ai_notable_error: string
}

export interface EvidenceLog {
  source_types_used: string[]
  official_doc_urls: string[]
  third_party_urls: string[]
  hands_on_notes: string
}

export interface Evaluation {
  meta: EvaluationMeta
  identity: EvaluationIdentity
  sections: {
    [section_key: string]: {
      [field_key: string]: FieldResponse
    }
  }
  ai_checks: {
    [section_key: string]: AIHallucinationCheck
  }
  assessment: EvaluationAssessment
  evidence_log: EvidenceLog
}

/** Section keys used in the form (for navigation and conditional logic) */
export const SECTION_KEYS = [
  'identity',
  'ingestion',
  'processing_2a',
  'processing_2b',
  'processing_2c_livestock',
  'processing_2d_cea',
  'processing_2e_financial',
  'export',
  'integration',
  'governance',
  'access',
  'pricing',
  'usability',
  'assessment',
  'evidence',
] as const

export type SectionKey = (typeof SECTION_KEYS)[number]
