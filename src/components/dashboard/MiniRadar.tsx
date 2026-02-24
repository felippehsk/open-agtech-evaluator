import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import type { Evaluation } from '@/lib/schema'
import { getRadarScores } from '@/lib/dashboardUtils'

interface MiniRadarProps {
  evaluation: Evaluation
  size?: number
  className?: string
}

export function MiniRadar({ evaluation, size = 100, className = '' }: MiniRadarProps) {
  const data = getRadarScores(evaluation)
  return (
    <div className={className} style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="section" tick={{ fontSize: 8 }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#0D7377"
            fill="#0D7377"
            fillOpacity={0.3}
            strokeWidth={1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
