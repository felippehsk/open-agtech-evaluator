import type { Evaluation } from '@/lib/schema'
import { getEvidenceQuality, oneEvaluationPerPlatform } from '@/lib/dashboardUtils'
import { InfoTip } from '@/components/shared/InfoTip'

interface SummaryStatsProps {
  evaluations: Evaluation[]
  className?: string
}

const STAT_TOOLTIPS: Record<string, string> = {
  'Platforms evaluated':
    'Number of distinct software platforms with at least one evaluation. Each card below represents one platform.',
  'Total evaluations':
    'Total number of evaluation submissions. A platform can have multiple evaluations (e.g. from different students or years).',
  'Evidence quality':
    'Percentage of answers marked as hands-on verified or documentation verified across all evaluations. Higher means more answers were checked against real use or official docs.',
  'Last updated': 'Date of the most recent evaluation submission in this dataset.',
}

export function SummaryStats({ evaluations, className = '' }: SummaryStatsProps) {
  const platforms = oneEvaluationPerPlatform(evaluations)
  const uniqueCount = platforms.length
  const totalCount = evaluations.length

  let evidenceVerified = 0
  let evidenceTotal = 0
  for (const e of evaluations) {
    const q = getEvidenceQuality(e)
    evidenceVerified += q.verified
    evidenceTotal += q.total
  }
  const evidencePercent = evidenceTotal > 0 ? Math.round((evidenceVerified / evidenceTotal) * 100) : 0

  const lastUpdatedRaw = evaluations.length
    ? evaluations.reduce((max, e) => (e.meta.evaluation_date > max ? e.meta.evaluation_date : max), '')
    : ''
  const lastUpdated = lastUpdatedRaw
    ? (() => {
        const d = new Date(lastUpdatedRaw)
        return Number.isNaN(d.getTime()) ? lastUpdatedRaw : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      })()
    : '—'

  const cards = [
    { label: 'Platforms evaluated', value: String(uniqueCount) },
    { label: 'Total evaluations', value: String(totalCount) },
    { label: 'Evidence quality', value: `${evidencePercent}% verified` },
    { label: 'Last updated', value: lastUpdated },
  ]

  return (
    <div className={`sticky top-0 z-10 flex flex-wrap gap-3 overflow-visible border-b border-slate-200 bg-slate-50/95 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 ${className}`}>
      {cards.map(({ label, value }) => (
        <div
          key={label}
          className="overflow-visible rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark"
        >
          <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
            <InfoTip text={STAT_TOOLTIPS[label] ?? ''} placement="bottom" />
          </p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
      ))}
    </div>
  )
}
