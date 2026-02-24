import type { FieldResponse } from '@/lib/schema'

const TAG_COLOR: Record<string, string> = {
  hands_on_verified: 'bg-emerald-500',
  documentation_verified: 'bg-blue-500',
  third_party_verified: 'bg-amber-400',
  vendor_claimed: 'bg-orange-500',
  unknown: 'bg-red-400',
  not_applicable: 'bg-slate-300 dark:bg-slate-600',
}

interface EvidenceDistributionProps {
  fields: (FieldResponse | undefined)[]
  maxDots?: number
  className?: string
}

export function EvidenceDistribution({ fields, maxDots = 12, className = '' }: EvidenceDistributionProps) {
  const applicable = fields.filter((f) => f && f.evidence_tag !== 'not_applicable')
  const sample = applicable.slice(0, maxDots)
  if (sample.length === 0) return null
  return (
    <div className={`flex flex-wrap gap-0.5 ${className}`} title="Evidence tags (🟢 hands-on, 🔵 docs, 🟡 third-party, 🟠 vendor, 🔴 unknown)">
      {sample.map((fr, i) => (
        <span
          key={i}
          className={`inline-block h-1.5 w-1.5 rounded-full ${TAG_COLOR[fr!.evidence_tag] ?? 'bg-slate-300 dark:bg-slate-600'}`}
          aria-hidden
        />
      ))}
    </div>
  )
}
