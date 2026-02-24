import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Evaluation } from '@/lib/schema'
import { getOverallAIAccuracy, getAIAccuracyBySection } from '@/lib/dashboardUtils'

const SECTION_LABELS: Record<string, string> = {
  ingestion: 'Ingestion',
  processing_2a: 'Spatial',
  processing_2b: 'Yield',
  export: 'Export',
  integration: 'Integration',
  governance: 'Governance',
  access: 'Access',
  pricing: 'Pricing',
  usability: 'Usability',
}

interface AIReliabilityPanelProps {
  evaluations: Evaluation[]
  className?: string
}

export function AIReliabilityPanel({ evaluations, className = '' }: AIReliabilityPanelProps) {
  const [showErrors, setShowErrors] = useState(false)
  const ai = getOverallAIAccuracy(evaluations)

  const bySection: Record<string, { correct: number; total: number }> = {}
  for (const e of evaluations) {
    for (const [section, check] of Object.entries(e.ai_checks ?? {})) {
      if (!bySection[section]) bySection[section] = { correct: 0, total: 0 }
      bySection[section].total++
      if (check === 'ai_100_correct' || check === 'ai_minor_errors') bySection[section].correct++
    }
  }
  const sectionData = Object.entries(bySection).map(([key, v]) => ({
    section: SECTION_LABELS[key] ?? key,
    percent: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    correct: v.correct,
    total: v.total,
  }))

  const notableErrors = evaluations
    .map((e) => ({
      platform: e.meta.platform_name,
      error: e.assessment?.ai_notable_error,
    }))
    .filter((x) => x.error && String(x.error).trim().length > 0)

  return (
    <div className={`space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark ${className}`}>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">AI reliability analysis</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total AI claims</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{ai.totalClaims}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Verified correct</p>
          <p className="text-xl font-semibold text-emerald-600 dark:text-emerald-400">{ai.correct}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Incorrect / unverifiable</p>
          <p className="text-xl font-semibold text-amber-600 dark:text-amber-400">{ai.incorrect + ai.unverifiable}</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Sections with correct AI</p>
          <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">{ai.percentSectionsCorrect}%</p>
        </div>
      </div>

      {sectionData.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">AI accuracy by section</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectionData} layout="vertical" margin={{ top: 4, right: 8, left: 60, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="section" width={56} tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Correct']} />
                <Bar dataKey="percent" fill="#0D7377" radius={[0, 4, 4, 0]} name="% correct" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {notableErrors.length > 0 && (
        <div>
          <button
            type="button"
            onClick={() => setShowErrors(!showErrors)}
            className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:underline"
          >
            {showErrors ? 'Hide' : 'Show'} notable AI errors ({notableErrors.length})
          </button>
          {showErrors && (
            <ul className="mt-2 space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
              {notableErrors.map(({ platform, error }, i) => (
                <li key={i} className="text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{platform}:</span>{' '}
                  <span className="text-slate-600 dark:text-slate-400">{String(error)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
