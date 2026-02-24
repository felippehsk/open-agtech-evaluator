import { useState, useEffect, useMemo, useReducer } from 'react'
import { Link } from 'react-router-dom'
import type { Evaluation } from '@/lib/schema'
import type { PlatformRecord } from '@/lib/dashboardUtils'
import { oneEvaluationPerPlatform } from '@/lib/dashboardUtils'
import { SummaryStats } from '@/components/dashboard/SummaryStats'
import { FilterPanel, filterEvaluations, INITIAL_FILTERS, type DashboardFilters } from '@/components/dashboard/FilterPanel'
import { PlatformCard } from '@/components/dashboard/PlatformCard'
import { ScoreRadar } from '@/components/dashboard/ScoreRadar'
import { ComparisonMatrix } from '@/components/dashboard/ComparisonMatrix'
import { PricingChart } from '@/components/dashboard/PricingChart'
import { AIReliabilityPanel } from '@/components/dashboard/AIReliabilityPanel'

const BASE = import.meta.env.BASE_URL || '/'

function filtersReducer(state: DashboardFilters, action: { type: string; payload?: Partial<DashboardFilters> }): DashboardFilters {
  if (action.type === 'SET') return { ...state, ...(action.payload ?? {}) }
  return state
}

export function DashboardPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [platforms, setPlatforms] = useState<PlatformRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, dispatchFilters] = useReducer(filtersReducer, INITIAL_FILTERS)
  const [compareSelected, setCompareSelected] = useState<string[]>([])

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}api/all_evaluations.json`).then((r) => (r.ok ? r.json() : [])),
      fetch(`${BASE}api/platforms.json`).then((r) => (r.ok ? r.json() : [])),
    ])
      .then(([evals, plats]) => {
        setEvaluations(Array.isArray(evals) ? evals : [])
        setPlatforms(Array.isArray(plats) ? plats : [])
      })
      .catch(() => {
        setEvaluations([])
        setPlatforms([])
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredEvaluations = useMemo(
    () => filterEvaluations(evaluations, filters, platforms),
    [evaluations, filters, platforms]
  )
  const platformCards = useMemo(() => oneEvaluationPerPlatform(filteredEvaluations), [filteredEvaluations])
  const compareEvaluations = useMemo(
    () => platformCards.filter((e) => compareSelected.includes(e.meta.platform_name)),
    [platformCards, compareSelected]
  )

  function handleCompareClick(ev: React.MouseEvent, platformName: string) {
    ev.preventDefault()
    ev.stopPropagation()
    setCompareSelected((prev) =>
      prev.includes(platformName) ? prev.filter((n) => n !== platformName) : [...prev, platformName]
    )
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-slate-500 dark:text-slate-400">Loading evaluations…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Evaluation dashboard</h1>
        <Link
          to="/form"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90"
        >
          New evaluation
        </Link>
      </div>

      <SummaryStats evaluations={evaluations} className="mb-6" />

      <FilterPanel
        evaluations={evaluations}
        platforms={platforms}
        filters={filters}
        onFiltersChange={(f) => dispatchFilters({ type: 'SET', payload: f })}
        className="mb-6"
      />

      {compareSelected.length >= 2 && (
        <div className="mb-8 space-y-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Compare platforms</h2>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
            <ScoreRadar evaluations={compareEvaluations} selectedNames={compareSelected} />
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-slate-900 dark:text-slate-100">Feature comparison</h3>
            <ComparisonMatrix evaluations={compareEvaluations} />
          </div>
          <div>
            <h3 className="mb-2 text-base font-medium text-slate-900 dark:text-slate-100">Pricing comparison</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">Grain (2,000 ac)</p>
                <PricingChart evaluations={compareEvaluations} mode="broadacre" />
              </div>
              <div>
                <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">Livestock (500 head)</p>
                <PricingChart evaluations={compareEvaluations} mode="livestock" />
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Platforms {platformCards.length < evaluations.length && `(${platformCards.length} of ${evaluations.length} evaluations)`}
      </h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {platformCards.map((evaluation) => (
          <PlatformCard
            key={`${evaluation.meta.platform_slug}-${evaluation.meta.evaluator}-${evaluation.meta.evaluation_date}`}
            evaluation={evaluation}
            platforms={platforms}
            compareChecked={compareSelected.includes(evaluation.meta.platform_name)}
            onCompareClick={(ev) => handleCompareClick(ev, evaluation.meta.platform_name)}
          />
        ))}
      </div>

      {platformCards.length === 0 && (
        <p className="py-12 text-center text-slate-500 dark:text-slate-400">
          No platforms match the current filters. Adjust filters or add evaluations.
        </p>
      )}

      <div className="mt-12">
        <AIReliabilityPanel evaluations={evaluations} />
      </div>
    </div>
  )
}
