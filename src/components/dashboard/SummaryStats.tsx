import type { Evaluation } from '@/lib/schema'
import {
  getEvidenceQuality,
  getOverallAIAccuracy,
  oneEvaluationPerPlatform,
} from '@/lib/dashboardUtils'

interface SummaryStatsProps {
  evaluations: Evaluation[]
  className?: string
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

  const ai = getOverallAIAccuracy(evaluations)
  const lastUpdated = evaluations.length
    ? evaluations.reduce((max, e) => (e.meta.evaluation_date > max ? e.meta.evaluation_date : max), '')
    : '—'

  const cards = [
    { label: 'Platforms evaluated', value: String(uniqueCount) },
    { label: 'Total evaluations', value: String(totalCount) },
    { label: 'Evidence quality', value: `${evidencePercent}% verified` },
    { label: 'Average AI accuracy', value: `${ai.percentSectionsCorrect}% sections correct` },
    { label: 'Last updated', value: lastUpdated },
  ]

  return (
    <div className={`sticky top-0 z-10 flex flex-wrap gap-3 border-b border-slate-200 bg-slate-50/95 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95 ${className}`}>
      {cards.map(({ label, value }) => (
        <div
          key={label}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark"
        >
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</p>
        </div>
      ))}
    </div>
  )
}
