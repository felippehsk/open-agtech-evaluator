import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import type { Evaluation } from '@/lib/schema'
import { getRadarScores } from '@/lib/dashboardUtils'

/** 6 axes: Ingestion, Processing, Export, Integration, Governance, Usability (same as MiniRadar). */
function evaluationToRadarPoints(e: Evaluation): { section: string; score: number; fullMark: number }[] {
  return getRadarScores(e).map(({ section, score }) => ({
    section,
    score,
    fullMark: 100,
  }))
}

export function ScoreRadar({
  evaluations,
  selectedNames,
}: {
  evaluations: Evaluation[]
  selectedNames: string[]
}) {
  const selected = evaluations.filter((e) => selectedNames.includes(e.meta.platform_name))
  if (selected.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-sm text-slate-500 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-400">
        Select platforms to compare (e.g. from the cards below).
      </div>
    )
  }

  const radarSections = ['Ingestion', 'Processing', 'Export', 'Integration', 'Governance', 'Usability']
  const dataBySection = radarSections.map((sectionName) => {
    const point: Record<string, string | number> = { section: sectionName }
    selected.forEach((e) => {
      const pts = evaluationToRadarPoints(e)
      const p = pts.find((x) => x.section === sectionName)
      point[e.meta.platform_name] = p?.score ?? 0
    })
    return point
  })

  const series = selected.map((e) => ({
    name: e.meta.platform_name,
    dataKey: e.meta.platform_name,
    stroke: ['#0D7377', '#E8A838', '#3B82F6', '#10B981'][selected.indexOf(e) % 4],
  }))

  return (
    <div className="h-64 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-2">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={dataBySection}>
          <PolarGrid />
          <PolarAngleAxis dataKey="section" tick={{ fontSize: 11 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          {series.map((s) => (
            <Radar
              key={s.name}
              name={s.name}
              dataKey={s.dataKey}
              stroke={s.stroke}
              fill={s.stroke}
              fillOpacity={0.2}
              strokeWidth={1.5}
            />
          ))}
          <Tooltip />
          <Legend />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  )
}
