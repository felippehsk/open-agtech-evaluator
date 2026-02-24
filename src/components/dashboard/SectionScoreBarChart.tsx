import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { calculateSectionScore } from '@/lib/scoring'
import type { Evaluation } from '@/lib/schema'

const SECTION_KEYS = ['ingestion', 'processing_2a', 'processing_2b', 'export', 'integration', 'governance', 'access', 'pricing', 'usability'] as const
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

const COLORS = ['#0D7377', '#E8A838', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899']

export function SectionScoreBarChart({
  evaluations,
  selectedNames,
}: {
  evaluations: Evaluation[]
  selectedNames: string[]
}) {
  const selected = evaluations.filter((e) => selectedNames.includes(e.meta.platform_name))
  if (selected.length === 0) return null

  const data = SECTION_KEYS.map((key) => {
    const point: Record<string, string | number> = {
      section: SECTION_LABELS[key] ?? key,
    }
    selected.forEach((e) => {
      const sec = e.sections?.[key]
      const s = sec ? calculateSectionScore(sec) : { evidence_weighted_score: 0 }
      point[e.meta.platform_name] = Math.round(s.evidence_weighted_score * 100)
    })
    return point
  })

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
          <XAxis dataKey="section" tick={{ fontSize: 11 }} className="text-slate-600 dark:text-slate-400" />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} className="text-slate-600 dark:text-slate-400" />
          <Tooltip
            contentStyle={{ borderRadius: '0.5rem', border: '1px solid var(--tw-slate-200)' }}
            labelStyle={{ color: 'inherit' }}
          />
          <Legend />
          {selected.map((e, i) => (
            <Bar
              key={e.meta.platform_name}
              dataKey={e.meta.platform_name}
              fill={COLORS[i % COLORS.length]}
              radius={[4, 4, 0, 0]}
              name={e.meta.platform_name}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
