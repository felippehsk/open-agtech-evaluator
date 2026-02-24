import type { EvidenceTag } from '@/lib/schema'
import { cn } from '@/lib/utils'

const TAGS: { value: EvidenceTag; label: string; short: string }[] = [
  { value: 'hands_on_verified', label: 'Hands-on verified', short: '🟢' },
  { value: 'documentation_verified', label: 'Documentation verified', short: '🔵' },
  { value: 'third_party_verified', label: 'Third-party verified', short: '🟡' },
  { value: 'vendor_claimed', label: 'Vendor-claimed', short: '🟠' },
  { value: 'unknown', label: 'Unknown / Not found', short: '🔴' },
  { value: 'not_applicable', label: 'N/A — Out of scope', short: '⚪' },
]

interface EvidenceTagSelectProps {
  value: EvidenceTag
  onChange: (tag: EvidenceTag) => void
  disabled?: boolean
}

export function EvidenceTagSelect({ value, onChange, disabled }: EvidenceTagSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as EvidenceTag)}
      disabled={disabled}
      className={cn(
        'rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-2 py-1 text-xs text-slate-900 dark:text-slate-100',
        disabled && 'opacity-60'
      )}
    >
      {TAGS.map((t) => (
        <option key={t.value} value={t.value}>
          {t.short} {t.label}
        </option>
      ))}
    </select>
  )
}
