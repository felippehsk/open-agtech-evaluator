import { Link } from 'react-router-dom'
import type { Evaluation } from '@/lib/schema'
import type { PlatformRecord } from '@/lib/dashboardUtils'
import {
  getPriceBadge,
  getHardwareDependency,
  getEvidenceQuality,
  getFeatureFlags,
  getOverallScore,
  getCategoryForPlatform,
  getADTCertified,
  getBestSuitedFor,
} from '@/lib/dashboardUtils'
import { MiniRadar } from './MiniRadar'
import { InfoTip } from '@/components/shared/InfoTip'

interface PlatformCardProps {
  evaluation: Evaluation
  platforms: PlatformRecord[]
  compareChecked: boolean
  onCompareToggle: (platformName: string) => void
}

const PRICE_BADGE_STYLE: Record<string, string> = {
  FREE: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200',
  FREEMIUM: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-200',
  $: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200',
  '$$$': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
}

export function PlatformCard({ evaluation, platforms, compareChecked, onCompareToggle }: PlatformCardProps) {
  const { meta, identity } = evaluation
  const category = getCategoryForPlatform(meta.platform_slug, platforms)
  const priceBadge = getPriceBadge(evaluation)
  const hardware = getHardwareDependency(evaluation)
  const evidence = getEvidenceQuality(evaluation)
  const score = getOverallScore(evaluation)
  const flags = getFeatureFlags(evaluation)
  const adt = getADTCertified(evaluation)
  const bestFor = getBestSuitedFor(evaluation).slice(0, 3)
  const evaluatorSlug = meta.evaluator.replace(/[^a-zA-Z0-9_-]/g, '-')

  const featureItems = [
    { key: 'shapefile', label: 'Shapefile', value: flags.shapefile },
    { key: 'isoxml', label: 'ISOXML', value: flags.isoxml },
    { key: 'adapt', label: 'ADAPT', value: flags.adapt },
    { key: 'offline', label: 'Offline', value: flags.offline },
    { key: 'publicApi', label: 'Public API', value: flags.publicApi },
  ]

  const dateStr = meta.evaluation_date
    ? (() => {
        const d = new Date(meta.evaluation_date)
        return Number.isNaN(d.getTime()) ? meta.evaluation_date : d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
      })()
    : ''
  const cardTitle = `Evaluation of ${meta.platform_name} by ${meta.evaluator}${dateStr ? `, ${dateStr}` : ''}. Click to view full details or check Compare to add to side-by-side comparison.`

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:shadow-md dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark"
      title={cardTitle}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-600 dark:text-slate-200">
            {category}
          </span>
          {priceBadge && (
            <span className={`rounded px-2 py-0.5 text-xs font-medium ${PRICE_BADGE_STYLE[priceBadge] ?? ''}`}>
              {priceBadge === '$' ? '$' : priceBadge === '$$$' ? '$$$' : priceBadge}
            </span>
          )}
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-sm" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={compareChecked}
            onChange={() => onCompareToggle(meta.platform_name)}
            className="rounded border-slate-300 text-primary dark:border-slate-500"
            aria-label={`Compare ${meta.platform_name}`}
          />
          Compare
        </label>
      </div>

      <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-slate-100">{meta.platform_name}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        {identity?.company_developer ?? '—'} • {identity?.country_of_origin ?? '—'}
      </p>

      <div className="my-3 flex justify-center">
        <MiniRadar evaluation={evaluation} size={100} />
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-300">Score: {score}%</span>
        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
          Evidence: {evidence.percent}% verified
          <InfoTip text="Share of this evaluation’s answers that were marked hands-on verified or documentation verified. Higher means the evaluator checked more answers against real use or official docs." />
        </span>
      </div>

      <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
        {featureItems.map(({ key, label, value }) => (
          <span key={key} className="text-slate-600 dark:text-slate-400">
            {value === true && <span className="text-emerald-600 dark:text-emerald-400">✅ {label}</span>}
            {value === false && <span className="text-slate-400 dark:text-slate-500">❌ {label}</span>}
            {value === 'na' && <span className="text-slate-400">— {label}</span>}
          </span>
        ))}
      </div>

      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
        {hardware === 'independent' && <span>🔓 Software-independent</span>}
        {hardware === 'enhanced' && <span>🔒 Enhanced by hardware</span>}
        {hardware === 'locked' && <span>🔒 Locked to hardware</span>}
        {priceBadge === 'FREEMIUM' && <span>📋 Freemium</span>}
        {adt && <span>🇨🇦 ADT Certified</span>}
        {!adt && <span>📋 Not ADT Certified</span>}
      </div>

      {bestFor.length > 0 && (
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          Best for: {bestFor.join(', ')}
        </p>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        <Link
          to={`/evaluation/${meta.platform_slug}/${evaluatorSlug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          View Details →
        </Link>
      </div>
    </div>
  )
}
