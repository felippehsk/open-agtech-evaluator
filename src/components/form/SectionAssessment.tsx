import { useFormState } from '@/context/FormStateContext'
import { getFieldsForSection } from '@/lib/fieldConfig'
import { cn } from '@/lib/utils'

export function SectionAssessment() {
  const { state, dispatch } = useFormState()
  const assessment = state.draft.assessment ?? {}
  const fields = getFieldsForSection('assessment')

  function update(field: string, value: string | string[] | number) {
    dispatch({
      type: 'SET_ASSESSMENT',
      payload: { [field]: value },
    })
  }

  const getVal = (key: string) => {
    const v = (assessment as Record<string, unknown>)[key]
    if (Array.isArray(v)) return v
    if (typeof v === 'number') return v
    return (v as string) ?? ''
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Critical assessment</h3>

      {fields.map((config) => {
        const val = getVal(config.key)
        if (config.type === 'number') {
          return (
            <div key={config.key} className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{config.label}</label>
              <input
                type="number"
                value={val === 0 ? '' : Number(val)}
                onChange={(e) => update(config.key, e.target.value === '' ? 0 : Number(e.target.value))}
                min={0}
                className="w-24 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              />
            </div>
          )
        }
        if (config.type === 'single_select') {
          return (
            <div key={config.key} className="space-y-1">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{config.label}</label>
              <select
                value={String(val)}
                onChange={(e) => update(config.key, e.target.value)}
                className="w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="">Select…</option>
                {(config.options ?? []).map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          )
        }
        if (config.type === 'multi_select') {
          const arr = (val as string[]) || []
          return (
            <div key={config.key} className="space-y-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{config.label}</label>
              <div className="flex flex-wrap gap-2">
                {(config.options ?? []).map((opt) => (
                  <label key={opt} className={cn('inline-flex cursor-pointer items-center gap-1.5 rounded border px-2.5 py-1 text-sm', arr.includes(opt) ? 'border-primary bg-primary/10' : 'border-slate-300 dark:border-slate-600')}>
                    <input type="checkbox" checked={arr.includes(opt)} onChange={(e) => update(config.key, e.target.checked ? [...arr, opt] : arr.filter((x) => x !== opt))} className="rounded text-primary" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          )
        }
        // textarea
        return (
          <div key={config.key} className="space-y-1">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{config.label}</label>
            <textarea
              value={String(val)}
              onChange={(e) => update(config.key, e.target.value)}
              maxLength={config.maxLength}
              rows={3}
              className="w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
        )
      })}
    </div>
  )
}
