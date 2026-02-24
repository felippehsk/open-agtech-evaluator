import { useRef, useState } from 'react'
import { useFormState } from '@/context/FormStateContext'
import type { DraftState } from '@/context/FormStateContext'
import { getStoredPat, getStoredUsername } from '@/components/PATModal'
import { commitEvaluation } from '@/lib/github'
import { buildEvaluation } from '@/lib/buildEvaluation'
import { SOURCE_TYPES_USED } from '@/lib/fieldConfig'
import { cn } from '@/lib/utils'

const DRAFT_STORAGE_KEY = 'agt3510_evaluation_draft'

const EMPTY_DRAFT: DraftState = {
  meta: {},
  identity: {},
  sections: {},
  ai_checks: {},
  assessment: {},
  evidence_log: {},
}

function isDraftLike(obj: unknown): obj is DraftState {
  if (!obj || typeof obj !== 'object') return false
  const o = obj as Record<string, unknown>
  return 'meta' in o || 'identity' in o || 'sections' in o
}

export function SectionEvidence() {
  const { state, dispatch } = useFormState()
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null)
  const [loadResult, setLoadResult] = useState<{ ok: boolean; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const draft = state.draft
  const evidenceLog = draft.evidence_log ?? {}
  const evaluator = getStoredUsername() ?? (draft.meta as { evaluator?: string })?.evaluator ?? ''
  const totalHours = draft.meta?.total_hours_spent ?? 0

  function handleDownloadDraft() {
    const json = JSON.stringify(draft, null, 2)
    const slug = draft.meta?.platform_slug || 'draft'
    const date = new Date().toISOString().slice(0, 10)
    const filename = `agt3510-draft-${slug}-${date}.json`
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleLoadDraftClick() {
    setLoadResult(null)
    fileInputRef.current?.click()
  }

  function handleLoadDraftFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const raw = reader.result as string
        const parsed = JSON.parse(raw) as unknown
        if (!isDraftLike(parsed)) {
          setLoadResult({ ok: false, message: 'Invalid draft file. Use a file downloaded from this form.' })
          return
        }
        const merged: DraftState = {
          ...EMPTY_DRAFT,
          meta: { ...EMPTY_DRAFT.meta, ...(parsed.meta ?? {}) },
          identity: { ...EMPTY_DRAFT.identity, ...(parsed.identity ?? {}) },
          sections: { ...(parsed.sections ?? {}) },
          ai_checks: { ...(parsed.ai_checks ?? {}) },
          assessment: { ...EMPTY_DRAFT.assessment, ...(parsed.assessment ?? {}) },
          evidence_log: { ...EMPTY_DRAFT.evidence_log, ...(parsed.evidence_log ?? {}) },
        }
        dispatch({ type: 'LOAD_DRAFT', payload: merged })
        try {
          localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(merged))
        } catch {
          // ignore
        }
        setLoadResult({ ok: true, message: 'Draft restored. You can continue editing.' })
      } catch {
        setLoadResult({ ok: false, message: 'Could not read file. Use a valid draft JSON from this form.' })
      }
    }
    reader.readAsText(file)
  }

  async function handleSubmit() {
    const pat = getStoredPat()
    if (!pat) {
      setResult({ ok: false, message: 'Sign in with GitHub first (PAT required to submit).' })
      return
    }
    const username = getStoredUsername() ?? (draft.meta as { evaluator?: string })?.evaluator
    if (!username?.trim()) {
      setResult({ ok: false, message: 'Evaluator (GitHub username) is required. Sign in to set it.' })
      return
    }
    const versionValue = draft.sections?.identity?.version_module_evaluated?.value
    const versionFilled = typeof versionValue === 'string' && versionValue.trim().length > 0
    if (!draft.meta?.platform_slug || !versionFilled) {
      setResult({ ok: false, message: 'Complete Platform identity (platform and version) first.' })
      return
    }
    setSubmitting(true)
    setResult(null)
    const evaluation = buildEvaluation(draft, username.trim())
    const { success, url, error } = await commitEvaluation(pat, evaluation)
    setSubmitting(false)
    if (success) {
      setResult({ ok: true, message: url ? `Submitted. File: ${url}` : 'Submitted.' })
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY)
      } catch {
        // ignore
      }
    } else {
      setResult({ ok: false, message: error ?? 'Submit failed.' })
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Evidence log & submit</h3>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Confirm your evaluator name (GitHub username), total hours, and sources. Then submit to save this evaluation to the repository.
      </p>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Evaluator (GitHub username)</label>
        <input type="text" value={evaluator} readOnly className="mt-1 w-full max-w-md rounded border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-600 dark:text-slate-400" />
        <p className="mt-1 text-xs text-slate-500">Set by signing in with GitHub.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Total time spent on this evaluation (hours)</label>
        <input
          type="number"
          min={0}
          value={totalHours || ''}
          onChange={(e) => dispatch({ type: 'SET_META', payload: { total_hours_spent: e.target.value === '' ? 0 : Number(e.target.value) } })}
          className="mt-1 w-24 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Source types used</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {SOURCE_TYPES_USED.map((opt) => {
            const checked = (evidenceLog.source_types_used ?? []).includes(opt)
            return (
              <label key={opt} className={cn('inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1 text-sm', checked ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-600')}>
                <input type="checkbox" checked={checked} onChange={(e) => dispatch({ type: 'SET_EVIDENCE_LOG', payload: { source_types_used: e.target.checked ? [...(evidenceLog.source_types_used ?? []), opt] : (evidenceLog.source_types_used ?? []).filter((x) => x !== opt) } })} className="rounded text-primary" />
                {opt}
              </label>
            )
          })}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Official documentation URLs used (one per line)</label>
        <textarea
          value={(evidenceLog.official_doc_urls ?? []).join('\n')}
          onChange={(e) => dispatch({ type: 'SET_EVIDENCE_LOG', payload: { official_doc_urls: e.target.value.split(/\n/).map((s) => s.trim()).filter(Boolean) } })}
          rows={3}
          placeholder="https://…"
          className="mt-1 w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Third-party review sources (one per line)</label>
        <textarea
          value={(evidenceLog.third_party_urls ?? []).join('\n')}
          onChange={(e) => dispatch({ type: 'SET_EVIDENCE_LOG', payload: { third_party_urls: e.target.value.split(/\n/).map((s) => s.trim()).filter(Boolean) } })}
          rows={2}
          placeholder="https://…"
          className="mt-1 w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Hands-on testing notes</label>
        <textarea
          value={evidenceLog.hands_on_notes ?? ''}
          onChange={(e) => dispatch({ type: 'SET_EVIDENCE_LOG', payload: { hands_on_notes: e.target.value } })}
          rows={4}
          placeholder="What did you actually try in the platform? Screenshots encouraged."
          className="mt-1 w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
        />
      </div>

      <div className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
        <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200">Backup & restore</h4>
        <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          Download a copy to backup or move to another device; load a previously downloaded file to continue there.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={handleDownloadDraft} className="rounded border border-slate-300 dark:border-slate-600 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
            Download draft
          </button>
          <input ref={fileInputRef} type="file" accept=".json,application/json" className="hidden" onChange={handleLoadDraftFile} />
          <button type="button" onClick={handleLoadDraftClick} className="rounded border border-slate-300 dark:border-slate-600 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600">
            Load draft
          </button>
        </div>
        {loadResult && (
          <p className={cn('mt-2 text-sm', loadResult.ok ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300')}>
            {loadResult.message}
          </p>
        )}
      </div>

      {result && (
        <div className={cn('rounded-md p-3 text-sm', result.ok ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200' : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200')}>
          {result.message}
        </div>
      )}
      <button type="button" onClick={handleSubmit} disabled={submitting} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
        {submitting ? 'Submitting…' : 'Submit to GitHub'}
      </button>
    </div>
  )
}
