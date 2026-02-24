import type { EvidenceTag, FieldResponse } from '@/lib/schema'
import type { FieldConfig } from '@/lib/fieldConfig'
import { EvidenceTagSelect } from './EvidenceTagSelect'
import { cn } from '@/lib/utils'

export type { FieldConfig } from '@/lib/fieldConfig'
export type { FieldType } from '@/lib/fieldConfig'

interface FieldWithEvidenceProps {
  config: FieldConfig
  sectionKey: string
  value: FieldResponse
  onChange: (response: FieldResponse) => void
  disabled?: boolean
}

const RATING_OPTIONS = [1, 2, 3, 4, 5]
const OTHER_SPECIFY = 'Other (specify)'

export function FieldWithEvidence({ config, sectionKey, value, onChange, disabled }: FieldWithEvidenceProps) {
  const { key: fieldKey, label, type, options = [], placeholder, maxLength, ratingLabels } = config

  function updateValue(val: string | string[] | number | null) {
    onChange({ ...value, value: val })
  }

  function updateNotes(notes: string) {
    onChange({ ...value, notes: notes || undefined })
  }

  const showOtherSpecify =
    (type === 'single_select' && strVal === OTHER_SPECIFY) ||
    (type === 'multi_select' && arrVal.includes(OTHER_SPECIFY))
  const otherNotes = value.notes ?? ''

  function updateTag(tag: EvidenceTag) {
    onChange({ ...value, evidence_tag: tag })
  }

  function updateSourceUrl(url: string) {
    onChange({ ...value, source_url: url || undefined })
  }

  const val = value.value
  const strVal = typeof val === 'string' ? val : Array.isArray(val) ? '' : val != null ? String(val) : ''
  const arrVal = Array.isArray(val) ? val : []

  return (
    <div className="space-y-1.5 rounded border border-slate-100 dark:border-slate-700/50 bg-slate-50/50 dark:bg-slate-800/30 p-3">
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>

      {type === 'text' && (
        <input
          type="text"
          value={strVal}
          onChange={(e) => updateValue(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className="w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
        />
      )}

      {type === 'url' && (
        <input
          type="url"
          value={strVal}
          onChange={(e) => updateValue(e.target.value)}
          placeholder={placeholder ?? 'https://…'}
          disabled={disabled}
          className="w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
        />
      )}

      {type === 'textarea' && (
        <textarea
          value={strVal}
          onChange={(e) => updateValue(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          rows={3}
          disabled={disabled}
          className="w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
        />
      )}

      {type === 'number' && (
        <input
          type="number"
          value={val === null || val === undefined ? '' : Number(val)}
          onChange={(e) => updateValue(e.target.value === '' ? null : Number(e.target.value))}
          placeholder={placeholder}
          disabled={disabled}
          className="w-32 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
        />
      )}

      {type === 'single_select' && (
        <>
          <select
            value={strVal}
            onChange={(e) => updateValue(e.target.value || null)}
            disabled={disabled}
            className="w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="">Select…</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {showOtherSpecify && (
            <input
              type="text"
              value={otherNotes}
              onChange={(e) => updateNotes(e.target.value)}
              placeholder="Please specify:"
              disabled={disabled}
              className="mt-2 w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            />
          )}
        </>
      )}

      {type === 'multi_select' && (
        <div className="flex flex-wrap gap-2">
          {options.map((opt) => {
            const checked = arrVal.includes(opt)
            return (
              <label
                key={opt}
                className={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1 text-sm transition',
                  checked
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={(e) => {
                    const next = e.target.checked ? [...arrVal, opt] : arrVal.filter((x) => x !== opt)
                    updateValue(next)
                  }}
                  disabled={disabled}
                  className="rounded border-slate-300 text-primary"
                />
                {opt}
              </label>
            )
          })}
        </div>
      )}
      {type === 'multi_select' && showOtherSpecify && (
        <input
          type="text"
          value={otherNotes}
          onChange={(e) => updateNotes(e.target.value)}
          placeholder="Please specify:"
          disabled={disabled}
          className="mt-2 w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
        />
      )}

      {type === 'rating' && (
        <div className="flex flex-wrap items-center gap-2">
          {RATING_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => updateValue(n)}
              disabled={disabled}
              className={cn(
                'h-9 w-9 rounded border text-sm font-medium transition',
                val === n
                  ? 'border-primary bg-primary text-white'
                  : 'border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
              )}
            >
              {n}
            </button>
          ))}
          {ratingLabels && (
            <span className="ml-2 text-xs text-slate-500">
              {ratingLabels[0]} ← → {ratingLabels[1]}
            </span>
          )}
        </div>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <EvidenceTagSelect value={value.evidence_tag} onChange={updateTag} disabled={disabled} />
        <input
          type="url"
          value={value.source_url ?? ''}
          onChange={(e) => updateSourceUrl(e.target.value)}
          placeholder="Source URL (optional)"
          className="flex-1 min-w-[200px] rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-slate-600 dark:text-slate-400 placeholder:text-slate-400"
        />
      </div>
    </div>
  )
}
