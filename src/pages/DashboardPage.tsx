import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import type { Evaluation } from '@/lib/schema'
import { calculateSectionScore } from '@/lib/scoring'
import { ScoreRadar } from '@/components/dashboard/ScoreRadar'

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

  function toggleCompare(name: string) {
    setCompareSelected((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="text-slate-500">Loading evaluations…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Evaluation dashboard</h1>
        <Link to="/form" className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90">
          New evaluation
        </Link>
      </div>

      <p className="mb-6 text-slate-600 dark:text-slate-400">
        {evaluations.length} evaluation{evaluations.length !== 1 ? 's' : ''} loaded. Select platforms below to compare scores.
      </p>

      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Compare platforms</h2>
        <ScoreRadar evaluations={evaluations} selectedNames={compareSelected} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {evaluations.map((e) => {
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
            <div
              key={`${e.meta.platform_slug}-${e.meta.evaluator}-${e.meta.evaluation_date}`}
              className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <label className="flex cursor-pointer items-start gap-2">
                <input type="checkbox" checked={checked} onChange={() => toggleCompare(name)} className="mt-1 rounded text-primary" />
                <div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">{name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {e.meta.evaluator} • {e.meta.evaluation_date}
                  </p>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Overall score: {avg}%</p>
                </div>
              </label>
            </div>
          )
        })}
      </div>

      {evaluations.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800">
                <th className="p-3 text-left font-medium text-slate-900 dark:text-slate-100">Platform</th>
                <th className="p-3 text-left font-medium text-slate-900 dark:text-slate-100">Evaluator</th>
                <th className="p-3 text-left font-medium text-slate-900 dark:text-slate-100">Date</th>
                <th className="p-3 text-left font-medium text-slate-900 dark:text-slate-100">Version</th>
              </tr>
            </thead>
            <tbody>
              {evaluations.map((e, i) => (
                <tr key={i} className="border-b border-slate-100 dark:border-slate-700">
                  <td className="p-3 text-slate-900 dark:text-slate-100">{e.meta.platform_name}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{e.meta.evaluator}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{e.meta.evaluation_date}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{e.identity?.version_module_evaluated ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
