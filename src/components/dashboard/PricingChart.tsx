import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Evaluation } from '@/lib/schema'
import { getAnnualCostBroadacre, getAnnualCostLivestock } from '@/lib/dashboardUtils'

interface PricingChartProps {
  evaluations: Evaluation[]
  mode: 'broadacre' | 'livestock'
  className?: string
}

export function PricingChart({ evaluations, mode, className = '' }: PricingChartProps) {
  const getCost = mode === 'broadacre' ? getAnnualCostBroadacre : getAnnualCostLivestock
  const data = evaluations.map((e) => ({
    name: e.meta.platform_name,
    cost: getCost(e) ?? 0,
  }))

  if (data.length === 0) {
    return (
      <div className={`flex h-48 items-center justify-center rounded-xl border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-600 dark:text-slate-400 ${className}`}>
        No pricing data for {mode === 'broadacre' ? 'grain (2,000 ac)' : 'livestock (500 head)'}.
      </div>
    )
  }

  return (
    <div className={`h-48 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-600" />
          <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v}`} />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} />
          <Tooltip formatter={(v: number) => [`$${v.toLocaleString()}`, 'Annual cost']} />
          <Bar dataKey="cost" fill="#0D7377" radius={[0, 4, 4, 0]} name="Annual cost" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
