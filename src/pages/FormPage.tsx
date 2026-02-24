import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { SECTION_KEYS } from '@/lib/schema'
import { useFormState } from '@/context/FormStateContext'
import { showLivestockSection, showCEASection } from '@/lib/conditionalLogic'
import { SectionIdentity } from '@/components/form/SectionIdentity'
import { SectionFromConfig } from '@/components/form/SectionFromConfig'
import { SectionAssessment } from '@/components/form/SectionAssessment'
import { SectionEvidence } from '@/components/form/SectionEvidence'

const SECTION_TITLES_BASE: Record<string, string> = {
  identity: 'Platform identity',
  ingestion: '1. Data ingestion',
  'processing_2a': '2A. Spatial & temporal handling',
  'processing_2b': '2B. Yield & agronomic processing',
  'processing_2c_livestock': '2C. Livestock-specific',
  'processing_2d_cea': '2D. Greenhouse / CEA',
  'processing_2e_financial': '2E. Financial processing',
  export: '3. Data export',
  integration: '4. Integration & interoperability',
  governance: '5. Data governance',
  access: '6. Access & multi-user',
  pricing: '7. Pricing',
  usability: '8. Usability & support',
  assessment: '9. Critical assessment',
  evidence: '10. Evidence log & submit',
}

const PROCESSING_2_KEYS = ['processing_2a', 'processing_2b', 'processing_2c_livestock', 'processing_2d_cea', 'processing_2e_financial'] as const
const PROCESSING_2_LABELS: Record<string, string> = {
  processing_2a: 'Spatial & temporal handling',
  processing_2b: 'Yield & agronomic processing',
  processing_2c_livestock: 'Livestock-specific',
  processing_2d_cea: 'Greenhouse / CEA',
  processing_2e_financial: 'Financial processing',
}
const LETTERS = ['2A', '2B', '2C', '2D', '2E']

/** Build display titles so visible Section 2 steps are numbered 2A, 2B, 2C... with no gaps */
function buildDisplayTitles(orderedKeys: readonly string[]): Record<string, string> {
  const visible2 = orderedKeys.filter((k) => PROCESSING_2_KEYS.includes(k as (typeof PROCESSING_2_KEYS)[number]))
  const titles = { ...SECTION_TITLES_BASE }
  visible2.forEach((key, i) => {
    const letter = LETTERS[i] ?? String(i + 1)
    const content = PROCESSING_2_LABELS[key] ?? key
    titles[key] = `${letter}. ${content}`
  })
  return titles
}

export function FormPage() {
  const { state } = useFormState()
  const [step, setStep] = useState(0)
  const primaryFocus = state.draft.sections?.identity?.primary_agricultural_focus?.value
  const focusArr = Array.isArray(primaryFocus) ? primaryFocus : typeof primaryFocus === 'string' ? [primaryFocus] : []
  const show2C = showLivestockSection(focusArr)
  const show2D = showCEASection(focusArr)

  const orderedKeys = useMemo(
    () =>
      SECTION_KEYS.filter((k) => {
        if (k === 'processing_2c_livestock') return show2C
        if (k === 'processing_2d_cea') return show2D
        return true
      }),
    [show2C, show2D]
  )

  const displayTitles = useMemo(() => buildDisplayTitles(orderedKeys), [orderedKeys])
  const currentKey = orderedKeys[step] ?? orderedKeys[0]
  const canPrev = step > 0
  const canNext = step < orderedKeys.length - 1

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Platform evaluation form</h1>
        <Link to="/" className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
          ← Dashboard
        </Link>
      </div>

      <div className="mb-8 space-y-3">
        <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:text-slate-300 dark:shadow-soft-dark">
          Your progress is saved automatically on this browser. Use <strong>Download draft</strong> (in Evidence & submit) to backup or move to another device; use <strong>Load draft</strong> to restore.
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          <a href={`${import.meta.env.BASE_URL || '/'}AGT3510_Evaluation_Protocol.md`} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
            Download evaluation protocol & Gen AI prompt
          </a>
          {' '}
          — guidelines, all questions, and a prompt to use with ChatGPT/Claude to draft answers before you verify and fill the form.
        </p>
      </div>

      <div className="flex gap-8">
        <aside className="w-52 shrink-0">
          <nav className="sticky top-4 space-y-0.5 rounded-xl border border-slate-200 bg-white p-2 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
            {orderedKeys.map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => setStep(i)}
                className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${i === step ? 'bg-primary text-white shadow-sm dark:bg-primary' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700'}`}
              >
                {displayTitles[key] ?? key}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 rounded-2xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
          {currentKey === 'identity' && <SectionIdentity />}
          {currentKey === 'ingestion' && <SectionFromConfig sectionKey="ingestion" title={displayTitles.ingestion} />}
          {currentKey === 'processing_2a' && <SectionFromConfig sectionKey="processing_2a" title={displayTitles.processing_2a} />}
          {currentKey === 'processing_2b' && <SectionFromConfig sectionKey="processing_2b" title={displayTitles.processing_2b} />}
          {currentKey === 'processing_2c_livestock' && <SectionFromConfig sectionKey="processing_2c_livestock" title={displayTitles.processing_2c_livestock} />}
          {currentKey === 'processing_2d_cea' && <SectionFromConfig sectionKey="processing_2d_cea" title={displayTitles.processing_2d_cea} />}
          {currentKey === 'processing_2e_financial' && <SectionFromConfig sectionKey="processing_2e_financial" title={displayTitles.processing_2e_financial} />}
          {currentKey === 'export' && <SectionFromConfig sectionKey="export" title={displayTitles.export} />}
          {currentKey === 'integration' && <SectionFromConfig sectionKey="integration" title={displayTitles.integration} />}
          {currentKey === 'governance' && <SectionFromConfig sectionKey="governance" title={displayTitles.governance} />}
          {currentKey === 'access' && <SectionFromConfig sectionKey="access" title={displayTitles.access} />}
          {currentKey === 'pricing' && <SectionFromConfig sectionKey="pricing" title={displayTitles.pricing} />}
          {currentKey === 'usability' && <SectionFromConfig sectionKey="usability" title={displayTitles.usability} />}
          {currentKey === 'assessment' && <SectionAssessment />}
          {currentKey === 'evidence' && <SectionEvidence />}
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={!canPrev} className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700">
          Previous
        </button>
        <button type="button" onClick={() => setStep((s) => Math.min(orderedKeys.length - 1, s + 1))} disabled={!canNext} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90 disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  )
}
