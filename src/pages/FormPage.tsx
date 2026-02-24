import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SECTION_KEYS } from '@/lib/schema'
import { useFormState } from '@/context/FormStateContext'
import { showLivestockSection, showCEASection } from '@/lib/conditionalLogic'
import { SectionIdentity } from '@/components/form/SectionIdentity'
import { SectionFromConfig } from '@/components/form/SectionFromConfig'
import { SectionAssessment } from '@/components/form/SectionAssessment'
import { SectionEvidence } from '@/components/form/SectionEvidence'

const SECTION_TITLES: Record<string, string> = {
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

export function FormPage() {
  const { state } = useFormState()
  const [step, setStep] = useState(0)
  const primaryFocus = state.draft.sections?.identity?.primary_agricultural_focus?.value
  const focusArr = Array.isArray(primaryFocus) ? primaryFocus : typeof primaryFocus === 'string' ? [primaryFocus] : []
  const show2C = showLivestockSection(focusArr)
  const show2D = showCEASection(focusArr)

  const orderedKeys = SECTION_KEYS.filter((k) => {
    if (k === 'processing_2c_livestock') return show2C
    if (k === 'processing_2d_cea') return show2D
    return true
  })

  const currentKey = orderedKeys[step] ?? orderedKeys[0]
  const canPrev = step > 0
  const canNext = step < orderedKeys.length - 1

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Platform evaluation form</h1>
        <Link to="/" className="text-sm text-primary hover:underline">
          ← Dashboard
        </Link>
      </div>

      <div className="flex gap-8">
        <aside className="w-48 shrink-0">
          <nav className="sticky top-4 space-y-1">
            {orderedKeys.map((key, i) => (
              <button
                key={key}
                type="button"
                onClick={() => setStep(i)}
                className={`block w-full rounded px-2 py-1.5 text-left text-sm ${i === step ? 'bg-primary/15 font-medium text-primary' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'}`}
              >
                {SECTION_TITLES[key] ?? key}
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
          {currentKey === 'identity' && <SectionIdentity />}
          {currentKey === 'ingestion' && <SectionFromConfig sectionKey="ingestion" title={SECTION_TITLES.ingestion} />}
          {currentKey === 'processing_2a' && <SectionFromConfig sectionKey="processing_2a" title={SECTION_TITLES.processing_2a} />}
          {currentKey === 'processing_2b' && <SectionFromConfig sectionKey="processing_2b" title={SECTION_TITLES.processing_2b} />}
          {currentKey === 'processing_2c_livestock' && <SectionFromConfig sectionKey="processing_2c_livestock" title={SECTION_TITLES.processing_2c_livestock} />}
          {currentKey === 'processing_2d_cea' && <SectionFromConfig sectionKey="processing_2d_cea" title={SECTION_TITLES.processing_2d_cea} />}
          {currentKey === 'processing_2e_financial' && <SectionFromConfig sectionKey="processing_2e_financial" title={SECTION_TITLES.processing_2e_financial} />}
          {currentKey === 'export' && <SectionFromConfig sectionKey="export" title={SECTION_TITLES.export} />}
          {currentKey === 'integration' && <SectionFromConfig sectionKey="integration" title={SECTION_TITLES.integration} />}
          {currentKey === 'governance' && <SectionFromConfig sectionKey="governance" title={SECTION_TITLES.governance} />}
          {currentKey === 'access' && <SectionFromConfig sectionKey="access" title={SECTION_TITLES.access} />}
          {currentKey === 'pricing' && <SectionFromConfig sectionKey="pricing" title={SECTION_TITLES.pricing} />}
          {currentKey === 'usability' && <SectionFromConfig sectionKey="usability" title={SECTION_TITLES.usability} />}
          {currentKey === 'assessment' && <SectionAssessment />}
          {currentKey === 'evidence' && <SectionEvidence />}
        </div>
      </div>

      <div className="mt-6 flex justify-between">
        <button type="button" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={!canPrev} className="rounded border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium disabled:opacity-50">
          Previous
        </button>
        <button type="button" onClick={() => setStep((s) => Math.min(orderedKeys.length - 1, s + 1))} disabled={!canNext} className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
          Next
        </button>
      </div>
    </div>
  )
}
