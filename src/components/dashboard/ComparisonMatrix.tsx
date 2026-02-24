import type { Evaluation } from '@/lib/schema'
import {
  getFeatureFlags,
  getDataOwnership,
  getHardwareDependency,
  getAnnualCostBroadacre,
  getAnnualCostLivestock,
  type FeatureFlags,
} from '@/lib/dashboardUtils'

const EVIDENCE_DOT: Record<string, string> = {
  hands_on_verified: 'bg-emerald-500',
  documentation_verified: 'bg-blue-500',
  third_party_verified: 'bg-amber-400',
  vendor_claimed: 'bg-orange-500',
  unknown: 'bg-red-400',
  not_applicable: 'bg-slate-300 dark:bg-slate-600',
}

function getEvidenceTag(e: Evaluation, sectionKey: string, fieldKey: string): string | undefined {
  const section = e.sections?.[sectionKey]
  const fr = section?.[fieldKey]
  return fr?.evidence_tag
}

function formatFeatureValue(flags: FeatureFlags, key: keyof FeatureFlags): string {
  const v = flags[key]
  if (v === true) return '✅'
  if (v === false) return '❌'
  return '⚪ N/A'
}

function formatHardware(h: string): string {
  if (h === 'independent') return '🔓 Free'
  if (h === 'enhanced') return '🔒 Enhanced'
  if (h === 'locked') return '🔒 Locked'
  return '—'
}

interface RowDef {
  label: string
  getCell: (e: Evaluation) => { text: string; tag?: string }
}

function buildRows(): RowDef[] {
  return [
    {
      label: 'Shapefile import',
      getCell: (e) => {
        const f = getFeatureFlags(e)
        return { text: formatFeatureValue(f, 'shapefile'), tag: getEvidenceTag(e, 'ingestion', 'file_format_import_open') }
      },
    },
    {
      label: 'ISOXML import',
      getCell: (e) => {
        const f = getFeatureFlags(e)
        return { text: formatFeatureValue(f, 'isoxml'), tag: getEvidenceTag(e, 'ingestion', 'file_format_import_open') }
      },
    },
    {
      label: 'Yield data cleaning',
      getCell: (e) => {
        const sec = e.sections?.processing_2b
        const fr = sec?.yield_data_cleaning
        const has = Array.isArray(fr?.value) && (fr.value as string[]).length > 0
        return { text: has ? '✅' : '⚪ N/A', tag: fr?.evidence_tag }
      },
    },
    {
      label: 'VRA prescriptions',
      getCell: (e) => {
        const sec = e.sections?.processing_2b
        const fr = sec?.vra_prescription
        const has = Array.isArray(fr?.value) && (fr.value as string[]).some((x) => String(x).toLowerCase() !== 'not available')
        return { text: has ? '✅' : '⚪ N/A', tag: fr?.evidence_tag }
      },
    },
    {
      label: 'Public API',
      getCell: (e) => {
        const f = getFeatureFlags(e)
        return { text: formatFeatureValue(f, 'publicApi'), tag: getEvidenceTag(e, 'integration', 'api_availability') }
      },
    },
    {
      label: 'ADAPT support',
      getCell: (e) => {
        const f = getFeatureFlags(e)
        return { text: formatFeatureValue(f, 'adapt'), tag: getEvidenceTag(e, 'integration', 'adapt_support') }
      },
    },
    {
      label: 'Batch export',
      getCell: (e) => {
        const f = getFeatureFlags(e)
        return { text: formatFeatureValue(f, 'batchExport'), tag: getEvidenceTag(e, 'export', 'batch_export') }
      },
    },
    {
      label: 'Data ownership',
      getCell: (e) => {
        const ownership = getDataOwnership(e)
        const tag = getEvidenceTag(e, 'governance', 'data_ownership_policy')
        return { text: ownership || '—', tag }
      },
    },
    {
      label: 'Hardware dependency',
      getCell: (e) => {
        const h = getHardwareDependency(e)
        const tag = getEvidenceTag(e, 'integration', 'hardware_dependency')
        return { text: formatHardware(h), tag }
      },
    },
    {
      label: 'Annual cost (grain)',
      getCell: (e) => {
        const cost = getAnnualCostBroadacre(e)
        const tag = getEvidenceTag(e, 'pricing', 'standardized_cost_broadacre_annual')
        return { text: cost !== null ? (cost === 0 ? '$0 (free)' : `$${cost.toLocaleString()}`) : 'N/A', tag }
      },
    },
    {
      label: 'Annual cost (livestock)',
      getCell: (e) => {
        const cost = getAnnualCostLivestock(e)
        const tag = getEvidenceTag(e, 'pricing', 'standardized_cost_livestock_annual')
        return { text: cost !== null ? `$${cost.toLocaleString()}` : 'N/A', tag }
      },
    },
    {
      label: 'Recommendation',
      getCell: (e) => {
        const rec = e.assessment?.recommendation
        return { text: rec || '—' }
      },
    },
  ]
}

const ROWS = buildRows()

export function ComparisonMatrix({ evaluations }: { evaluations: Evaluation[] }) {
  if (evaluations.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
        Select at least two platforms to compare.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-600 dark:bg-slate-800/80">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
            <th className="p-3 font-semibold text-slate-900 dark:text-slate-100">Feature</th>
            {evaluations.map((e) => (
              <th key={`${e.meta.platform_slug}-${e.meta.evaluator}`} className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                {e.meta.platform_name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label} className="border-b border-slate-100 dark:border-slate-700">
              <td className="p-3 font-medium text-slate-700 dark:text-slate-300">{row.label}</td>
              {evaluations.map((e) => {
                const { text, tag } = row.getCell(e)
                return (
                  <td key={`${e.meta.platform_slug}-${e.meta.evaluator}`} className="p-3 text-slate-600 dark:text-slate-400">
                    <span className="inline-flex items-center gap-1.5">
                      {tag && (
                        <span
                          className={`inline-block h-2 w-2 shrink-0 rounded-full ${EVIDENCE_DOT[tag] ?? 'bg-slate-300 dark:bg-slate-600'}`}
                          title={tag}
                          aria-hidden
                        />
                      )}
                      {text}
                    </span>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
