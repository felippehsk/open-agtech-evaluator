import { useFormState } from '@/context/FormStateContext'
import { getFieldsForSection, getAiCheckOptions, SECTIONS_WITH_PLUGINS_CHECKBOX } from '@/lib/fieldConfig'
import { FieldWithEvidence } from '@/components/shared/FieldWithEvidence'
import type { FieldResponse } from '@/lib/schema'

const SECTIONS_WITH_AI_CHECK = ['ingestion', 'processing_2a', 'processing_2b', 'export', 'integration']

const DEFAULT_RESPONSE: FieldResponse = { value: null, evidence_tag: 'unknown' }

interface SectionFromConfigProps {
  sectionKey: string
  title: string
}

export function SectionFromConfig({ sectionKey, title }: SectionFromConfigProps) {
  const { state, setSectionField, dispatch } = useFormState()
  const fields = getFieldsForSection(sectionKey)
  const sectionData = state.draft.sections?.[sectionKey] ?? {}
  const showAiCheck = SECTIONS_WITH_AI_CHECK.includes(sectionKey)
  const aiCheckValue = state.draft.ai_checks?.[sectionKey] ?? ''
  const showPluginsCheckbox = (SECTIONS_WITH_PLUGINS_CHECKBOX as readonly string[]).includes(sectionKey)
  const sectionSourceUrls = (state.draft.evidence_log?.section_source_urls ?? {})[sectionKey] ?? []
  const pluginsChecked = state.draft.section_plugins_available?.[sectionKey] ?? false

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>

      {fields.map((config) => {
        const current = sectionData[config.key]
        const value: FieldResponse = current ?? {
          ...DEFAULT_RESPONSE,
          value: config.type === 'multi_select' ? [] : config.type === 'rating' ? null : null,
        }
        return (
          <FieldWithEvidence
            key={config.key}
            config={config}
            sectionKey={sectionKey}
            value={value}
            onChange={(response) => setSectionField(sectionKey, config.key, response)}
          />
        )
      })}

      <div className="space-y-3 rounded border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 p-3">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Source URLs for this section (one per line, optional)
        </label>
        <textarea
          value={sectionSourceUrls.join('\n')}
          onChange={(e) =>
            dispatch({
              type: 'SET_EVIDENCE_LOG',
              payload: {
                section_source_urls: {
                  ...(state.draft.evidence_log?.section_source_urls ?? {}),
                  [sectionKey]: e.target.value
                    .split(/\n/)
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              },
            })
          }
          rows={2}
          placeholder="https://…"
          className="w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
        />
      </div>

      {showPluginsCheckbox && (
        <label className="flex cursor-pointer items-center gap-2 rounded border border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800/30 p-3">
          <input
            type="checkbox"
            checked={pluginsChecked}
            onChange={(e) => dispatch({ type: 'SET_SECTION_PLUGINS', sectionKey, value: e.target.checked })}
            className="rounded border-slate-300 text-primary"
          />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Possible using plugins or extensions
          </span>
        </label>
      )}

      {showAiCheck && (
        <div className="mt-6 rounded border border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/20 p-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            AI hallucination check — this section
          </label>
          <select
            value={aiCheckValue}
            onChange={(e) => dispatch({ type: 'SET_AI_CHECK', section: sectionKey, value: e.target.value })}
            className="mt-1 w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
          >
            <option value="">Select…</option>
            {getAiCheckOptions().map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
