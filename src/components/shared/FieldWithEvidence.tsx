import { useState } from 'react'
import type { EvidenceTag, FieldResponse } from '@/lib/schema'
import type { FieldConfig } from '@/lib/fieldConfig'
import { EvidenceTagSelect } from './EvidenceTagSelect'
import { InfoTip } from './InfoTip'
import { cn } from '@/lib/utils'

interface FieldWithEvidenceProps {
  config: FieldConfig
  sectionKey: string
  value: FieldResponse
  onChange: (response: FieldResponse) => void
  disabled?: boolean
}

const RATING_OPTIONS = [1, 2, 3, 4, 5]
const OTHER_SPECIFY = 'Other (specify)'
const CUSTOM_OPTION_CONFIRM = 'Is adding this custom option really necessary? (It will be handled separately in analysis.)'

export function FieldWithEvidence({ config, sectionKey, value, onChange, disabled }: FieldWithEvidenceProps) {
  const { key: fieldKey, label, type, options = [], placeholder, maxLength, ratingLabels, allowCustomOptions } = config
  const [customModalOpen, setCustomModalOpen] = useState(false)
  const [customInput, setCustomInput] = useState('')

  function updateValue(val: string | string[] | number | null) {
    onChange({ ...value, value: val })
  }

  function updateNotes(notes: string) {
    onChange({ ...value, notes: notes || undefined })
  }

  function updateComment(comment: string) {
    onChange({ ...value, comment: comment || undefined })
  }

  function updateTag(tag: EvidenceTag) {
    onChange({ ...value, evidence_tag: tag })
  }

  function updateSourceUrls(urls: string[]) {
    onChange({
      ...value,
      source_url: urls[0] || undefined,
      source_urls: urls.length ? urls : undefined,
    })
  }

  const val = value.value
  const strVal = typeof val === 'string' ? val : Array.isArray(val) ? '' : val != null ? String(val) : ''
  const arrVal = Array.isArray(val) ? val : []
  const showOtherSpecify =
    (type === 'single_select' && strVal === OTHER_SPECIFY) ||
    (type === 'multi_select' && arrVal.includes(OTHER_SPECIFY))
  const otherNotes = value.notes ?? ''
  const sourceUrlsList = value.source_urls ?? (value.source_url ? [value.source_url] : [])
  const customValues =
    type === 'multi_select'
      ? (arrVal as string[]).filter((x) => !options.includes(x))
      : type === 'single_select' && strVal && !options.includes(strVal)
        ? [strVal]
        : []
  const hasCustomValues = customValues.length > 0
  const showAddCustom = allowCustomOptions && (type === 'multi_select' || type === 'single_select')

  function handleAddCustomOption() {
    const trimmed = customInput.trim()
    if (!trimmed) return
    if (type === 'multi_select') {
      updateValue([...arrVal, trimmed])
    } else {
      updateValue(trimmed)
    }
    setCustomInput('')
    setCustomModalOpen(false)
  }

  function handleRemoveCustomOption(customVal: string) {
    if (type === 'multi_select') {
      updateValue((arrVal as string[]).filter((x) => x !== customVal))
    } else {
      updateValue(null)
    }
  }

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
            value={options.includes(strVal) ? strVal : ''}
            onChange={(e) => updateValue(e.target.value || null)}
            disabled={disabled}
            className="w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="">Select…</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          {hasCustomValues && type === 'single_select' && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Custom:</span>
              {customValues.map((customVal) => (
                <span
                  key={customVal}
                  className="inline-flex items-center gap-1 rounded border border-amber-500/50 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 text-sm text-amber-800 dark:text-amber-200"
                >
                  {customVal}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomOption(customVal)}
                      className="rounded hover:bg-amber-200 dark:hover:bg-amber-800"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
          )}
          {showAddCustom && (
            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              disabled={disabled}
              className="mt-2 text-sm text-primary hover:underline"
            >
              + Add custom option (if not listed)
            </button>
          )}
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
        <>
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
                      const next = e.target.checked ? [...arrVal, opt] : (arrVal as string[]).filter((x) => x !== opt)
                      updateValue(next)
                    }}
                    disabled={disabled}
                    className="rounded border-slate-300 text-primary"
                  />
                  {opt}
                </label>
              )
            })}
            {hasCustomValues &&
              (arrVal as string[]).filter((x) => !options.includes(x)).map((customVal) => (
                <span
                  key={customVal}
                  className="inline-flex items-center gap-1 rounded border border-amber-500/50 bg-amber-50 dark:bg-amber-900/20 px-2.5 py-1 text-sm text-amber-800 dark:text-amber-200"
                >
                  {customVal}
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomOption(customVal)}
                      className="rounded hover:bg-amber-200 dark:hover:bg-amber-800"
                      aria-label="Remove"
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
          </div>
          {showAddCustom && (
            <button
              type="button"
              onClick={() => setCustomModalOpen(true)}
              disabled={disabled}
              className="mt-2 text-sm text-primary hover:underline"
            >
              + Add custom option (if not listed)
            </button>
          )}
        </>
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

      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <EvidenceTagSelect value={value.evidence_tag} onChange={updateTag} disabled={disabled} />
            <InfoTip text="How did you verify this answer? Hands-on = you tested it; Documentation = official docs; Vendor-claimed = only marketing; Unknown = could not confirm." placement="top" />
          </span>
        </div>
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400">Source URL(s) — one per line (optional)</label>
          <textarea
            value={sourceUrlsList.join('\n')}
            onChange={(e) =>
              updateSourceUrls(
                e.target.value
                  .split(/\n/)
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
            placeholder="https://…"
            rows={2}
            disabled={disabled}
            className="mt-0.5 w-full max-w-md rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-slate-600 dark:text-slate-400 placeholder:text-slate-400"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 dark:text-slate-400">Comment (optional)</label>
          <input
            type="text"
            value={value.comment ?? ''}
            onChange={(e) => updateComment(e.target.value)}
            placeholder="Add a comment to improve research…"
            disabled={disabled}
            className="mt-0.5 w-full max-w-md rounded border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-slate-600 dark:text-slate-400 placeholder:text-slate-400"
          />
        </div>
      </div>

      {customModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-600 dark:bg-slate-800">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">{CUSTOM_OPTION_CONFIRM}</p>
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Enter custom value…"
              className="mb-3 w-full rounded border border-slate-300 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCustomOption()
                if (e.key === 'Escape') setCustomModalOpen(false)
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => { setCustomModalOpen(false); setCustomInput('') }}
                className="rounded border border-slate-300 px-2 py-1 text-sm dark:border-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCustomOption}
                disabled={!customInput.trim()}
                className="rounded bg-primary px-2 py-1 text-sm text-white disabled:opacity-50"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
