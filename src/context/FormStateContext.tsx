import { createContext, useContext, useReducer, useCallback, useEffect } from 'react'
import type { FieldResponse, EvidenceLog, AIHallucinationCheck } from '@/lib/schema'

const DRAFT_STORAGE_KEY = 'agt3510_evaluation_draft'

export interface DraftMeta {
  schema_version?: '1.0'
  platform_slug?: string
  platform_name?: string
  evaluator?: string
  evaluation_date?: string
  last_verified_date?: string
  cohort?: string
  total_hours_spent?: number
}

export interface DraftIdentity {
  version_module_evaluated?: string
  company_developer?: string
  country_of_origin?: string
  year_founded?: string
  platform_type?: string[]
  primary_agricultural_focus?: string[]
  website_url?: string
  last_updated_version?: string
}

export interface DraftState {
  meta: DraftMeta
  identity: DraftIdentity
  sections: {
    [sectionKey: string]: {
      [fieldKey: string]: FieldResponse
    }
  }
  ai_checks: {
    [sectionKey: string]: string
  }
  assessment: Record<string, string | string[] | number>
  evidence_log: Partial<EvidenceLog>
}

const initialDraft: DraftState = {
  meta: {},
  identity: {},
  sections: {},
  ai_checks: {},
  assessment: {},
  evidence_log: {},
}

type FormAction =
  | { type: 'SET_META'; payload: Partial<DraftMeta> }
  | { type: 'SET_IDENTITY'; payload: Partial<DraftIdentity> }
  | { type: 'SET_SECTION_FIELD'; sectionKey: string; fieldKey: string; response: FieldResponse }
  | { type: 'SET_AI_CHECK'; section: string; value: string }
  | { type: 'SET_ASSESSMENT'; payload: Record<string, string | string[] | number> }
  | { type: 'SET_EVIDENCE_LOG'; payload: Partial<EvidenceLog> }
  | { type: 'SET_EVALUATOR'; payload: string }
  | { type: 'LOAD_DRAFT'; payload: DraftState }
  | { type: 'RESET' }

function formReducer(state: { draft: DraftState }, action: FormAction): { draft: DraftState } {
  switch (action.type) {
    case 'SET_META':
      return { draft: { ...state.draft, meta: { ...(state.draft.meta ?? {}), ...action.payload } } }
    case 'SET_IDENTITY':
      return { draft: { ...state.draft, identity: { ...(state.draft.identity ?? {}), ...action.payload } } }
    case 'SET_SECTION_FIELD': {
      const sections = { ...(state.draft.sections ?? {}) }
      const sec = { ...(sections[action.sectionKey] ?? {}) }
      sec[action.fieldKey] = action.response
      sections[action.sectionKey] = sec
      return { draft: { ...state.draft, sections } }
    }
    case 'SET_AI_CHECK': {
      const ai_checks = { ...(state.draft.ai_checks ?? {}) }
      ai_checks[action.section] = action.value
      return { draft: { ...state.draft, ai_checks } }
    }
    case 'SET_ASSESSMENT':
      return { draft: { ...state.draft, assessment: { ...(state.draft.assessment ?? {}), ...action.payload } } }
    case 'SET_EVIDENCE_LOG':
      return { draft: { ...state.draft, evidence_log: { ...(state.draft.evidence_log ?? {}), ...action.payload } } }
    case 'SET_EVALUATOR':
      return { draft: { ...state.draft, meta: { ...(state.draft.meta ?? {}), evaluator: action.payload } } }
    case 'LOAD_DRAFT':
      return { draft: action.payload }
    case 'RESET':
      return { draft: initialDraft }
    default:
      return state
  }
}

interface FormStateContextValue {
  state: { draft: DraftState }
  dispatch: React.Dispatch<FormAction>
  setSectionField: (sectionKey: string, fieldKey: string, response: FieldResponse) => void
  setEvaluator: (username: string) => void
}

const FormStateContext = createContext<FormStateContextValue | null>(null)

export function FormStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, { draft: initialDraft })

  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as DraftState
        if (parsed && (parsed.sections || parsed.identity || parsed.meta))
          dispatch({ type: 'LOAD_DRAFT', payload: { ...initialDraft, ...parsed } })
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    try {
      if (state.draft && (Object.keys(state.draft.sections ?? {}).length > 0 || state.draft.identity?.version_module_evaluated))
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state.draft))
    } catch {
      // ignore
    }
  }, [state.draft])

  const setSectionField = useCallback((sectionKey: string, fieldKey: string, response: FieldResponse) => {
    dispatch({ type: 'SET_SECTION_FIELD', sectionKey, fieldKey, response })
  }, [])

  const setEvaluator = useCallback((username: string) => {
    dispatch({ type: 'SET_EVALUATOR', payload: username })
  }, [])

  return (
    <FormStateContext.Provider value={{ state, dispatch, setSectionField, setEvaluator }}>
      {children}
    </FormStateContext.Provider>
  )
}

export function useFormState(): FormStateContextValue {
  const ctx = useContext(FormStateContext)
  if (!ctx) throw new Error('useFormState must be used within FormStateProvider')
  return ctx
}
