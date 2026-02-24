import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Evaluation } from '@/lib/schema'
import { calculateSectionScore } from '@/lib/scoring'
import { ScoreRadar } from '@/components/dashboard/ScoreRadar'
import { SectionScoreBarChart } from '@/components/dashboard/SectionScoreBarChart'

const BASE = import.meta.env.BASE_URL || '/'

export function DashboardPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [compareSelected, setCompareSelected] = useState<string[]>([])

  useEffect(() => {
    fetch(`${BASE}api/all_evaluations.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setEvaluations(Array.isArray(data) ? data : []))
      .catch(() => setEvaluations([]))
      .finally(() => setLoading(false))
  }, [])

  function toggleCompare(ev: React.MouseEvent, name: string) {
    ev.preventDefault()
    ev.stopPropagation()
    setCompareSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-slate-500 dark:text-slate-400">Loading evaluations…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Evaluation dashboard</h1>
        <Link to="/form" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:opacity-90">
          New evaluation
        </Link>
      </div>

      <p className="mb-8 text-slate-600 dark:text-slate-400">
        {evaluations.length} evaluation{evaluations.length !== 1 ? 's' : ''} loaded. Click a platform to view full details, or select several to compare scores.
      </p>

      {/* Compare: radar + bar chart */}
      <div className="mb-10 space-y-6">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Compare platforms</h2>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
          <ScoreRadar evaluations={evaluations} selectedNames={compareSelected} />
        </div>
        {compareSelected.length > 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
            <h3 className="mb-3 text-base font-semibold text-slate-900 dark:text-slate-100">Section scores (bar)</h3>
            <SectionScoreBarChart evaluations={evaluations} selectedNames={compareSelected} />
          </div>
        )}
      </div>

      {/* Platform cards: click to view details, checkbox to compare */}
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">All evaluations</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {evaluations.map((e, idx) => {
          const sections = ['ingestion', 'processing_2a', 'processing_2b', 'export', 'integration', 'usability'] as const
          const scores = sections.map((key) => {
            const sec = e.sections?.[key]
            const s = sec ? calculateSectionScore(sec) : { evidence_weighted_score: 0 }
            return Math.round(s.evidence_weighted_score * 100)
          })
          const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
          const name = e.meta.platform_name
          const checked = compareSelected.includes(name)
          return (
            <Link
              key={`${e.meta.platform_slug}-${e.meta.evaluator}-${e.meta.evaluation_date}`}
              to={`/evaluation/${idx}`}
              className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:shadow-md hover:border-primary/30 dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark dark:hover:border-primary/40"
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => {}}
                  onClick={(ev) => toggleCompare(ev, name)}
                  className="mt-1 shrink-0 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-500"
                  aria-label={`Compare ${name}`}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100">{name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {e.meta.evaluator} • {e.meta.evaluation_date}
                  </p>
                  <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-300">Overall score: {avg}%</p>
                  <span className="mt-2 inline-block text-sm font-medium text-primary hover:underline">View full evaluation →</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {evaluations.length > 0 && (
        <div className="mt-10 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-800">
                <th className="p-4 text-left font-semibold text-slate-900 dark:text-slate-100">Platform</th>
                <th className="p-4 text-left font-semibold text-slate-900 dark:text-slate-100">Evaluator</th>
                <th className="p-4 text-left font-semibold text-slate-900 dark:text-slate-100">Date</th>
                <th className="p-4 text-left font-semibold text-slate-900 dark:text-slate-100">Version</th>
                <th className="p-4 text-left font-semibold text-slate-900 dark:text-slate-100">Score</th>
                <th className="p-4 text-left font-semibold text-slate-900 dark:text-slate-100">Action</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((e, i) => {
                const secKeys = ['ingestion', 'processing_2a', 'processing_2b', 'export', 'integration', 'usability'] as const
                const avg = secKeys.length
                  ? Math.round(
                      (secKeys.reduce((a, k) => a + (e.sections?.[k] ? calculateSectionScore(e.sections[k]).evidence_weighted_score * 100 : 0), 0) / secKeys.length)
                    )
                  : 0
                return (
                  <tr key={i} className="border-b border-slate-100 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700/50">
                    <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{e.meta.platform_name}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{e.meta.evaluator}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{e.meta.evaluation_date}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{e.identity?.version_module_evaluated ?? '—'}</td>
                    <td className="p-4 text-slate-600 dark:text-slate-400">{avg}%</td>
                    <td className="p-4">
                      <Link to={`/evaluation/${i}`} className="font-medium text-primary hover:underline">View details</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
