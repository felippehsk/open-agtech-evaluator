import { useState } from 'react'
import type { Evaluation } from '@/lib/schema'
import type { PlatformRecord } from '@/lib/dashboardUtils'
import {
  getOEMCompatibility,
  getDataOwnership,
  getEvidenceQuality,
  getCategoryForPlatform,
  getPriceBadge,
  getHardwareDependency,
  searchMatchesEvaluation,
} from '@/lib/dashboardUtils'

export interface DashboardFilters {
  search: string
  categories: string[]
  agriculturalFocus: string[]
  equipment: string[]
  hardwareDependency: string[]
  price: string[]
  dataOwnership: string[]
  evidenceMinPercent: number
}

export const INITIAL_FILTERS: DashboardFilters = {
  search: '',
  categories: [],
  agriculturalFocus: [],
  equipment: [],
  hardwareDependency: [],
  price: [],
  dataOwnership: [],
  evidenceMinPercent: 0,
}

function toggleSet(arr: string[], value: string): string[] {
  if (arr.includes(value)) return arr.filter((x) => x !== value)
  return [...arr, value]
}

export function filterEvaluations(
  evaluations: Evaluation[],
  filters: DashboardFilters,
  platforms: PlatformRecord[]
): Evaluation[] {
  return evaluations.filter((e) => {
    if (filters.search && !searchMatchesEvaluation(e, filters.search)) return false
    if (filters.categories.length > 0) {
      const cat = getCategoryForPlatform(e.meta.platform_slug, platforms)
      if (!filters.categories.includes(cat)) return false
    }
    const focus = e.identity?.primary_agricultural_focus ?? []
    const focusArr = Array.isArray(focus) ? focus : [focus]
    if (filters.agriculturalFocus.length > 0) {
      const match = filters.agriculturalFocus.some((f) => focusArr.includes(f))
      if (!match) return false
    }
    if (filters.equipment.length > 0) {
      const oem = getOEMCompatibility(e)
      const match = filters.equipment.some((brand) => oem.some((x) => x.toLowerCase().includes(brand.toLowerCase())))
      if (!match) return false
    }
    if (filters.hardwareDependency.length > 0) {
      const hw = getHardwareDependency(e)
      if (!filters.hardwareDependency.includes(hw) && hw !== 'unknown') return false
      if (hw === 'unknown' && !filters.hardwareDependency.includes('unknown')) return false
    }
    if (filters.price.length > 0) {
      const badge = getPriceBadge(e)
      if (!badge || !filters.price.includes(badge)) return false
    }
    if (filters.dataOwnership.length > 0) {
      const ownership = getDataOwnership(e).toLowerCase()
      const match = filters.dataOwnership.some((o) => ownership.includes(o.toLowerCase()))
      if (!match) return false
    }
    if (filters.evidenceMinPercent > 0) {
      const q = getEvidenceQuality(e)
      if (q.percent < filters.evidenceMinPercent) return false
    }
    return true
  })
}

interface FilterPanelProps {
  evaluations: Evaluation[]
  platforms: PlatformRecord[]
  filters: DashboardFilters
  onFiltersChange: (f: DashboardFilters) => void
  className?: string
}

const CATEGORY_OPTIONS = [
  'Large Machinery',
  'Ag Input',
  'Data-Driven Agronomic',
  'Remote Sensing',
  'Farm Financial',
  'Greenhouse / CEA',
  'Livestock',
  'Open-Source',
  'Other',
]

const FOCUS_OPTIONS = [
  'Broadacre crops (grains, oilseeds, pulses)',
  'Row crops (corn, soybeans, cotton)',
  'Livestock — Beef',
  'Livestock — Dairy',
  'Greenhouse / Controlled Environment Agriculture (CEA)',
  'Mixed / Whole-farm',
]

const EQUIPMENT_OPTIONS = ['John Deere', 'Case IH', 'New Holland', 'AGCO', 'CLAAS', 'Brand-agnostic']
const HARDWARE_OPTIONS = [
  { value: 'independent', label: 'Software-independent' },
  { value: 'enhanced', label: 'Enhanced by hardware' },
  { value: 'locked', label: 'Locked to hardware' },
]
const PRICE_OPTIONS = [
  { value: 'FREE', label: 'Free' },
  { value: 'FREEMIUM', label: 'Freemium' },
  { value: '$', label: 'Paid subscription' },
  { value: '$$$', label: 'Enterprise' },
]
const OWNERSHIP_OPTIONS = ['User owns', 'Shared', 'Unclear']

function ChipFilter<T extends string>({
  options,
  selected,
  onToggle,
  label,
  getLabel,
}: {
  options: T[] | { value: T; label: string }[]
  selected: string[]
  onToggle: (value: T) => void
  label: string
  getLabel?: (x: T) => string
}) {
  const list = options.map((o) => (typeof o === 'string' ? { value: o as T, label: o } : o))
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</span>
      {list.map(({ value, label: l }) => (
        <button
          key={value}
          type="button"
          onClick={() => onToggle(value)}
          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
            selected.includes(value)
              ? 'bg-primary text-white dark:bg-primary'
              : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          {getLabel ? getLabel(value) : l}
        </button>
      ))}
    </div>
  )
}

export function FilterPanel({ evaluations, platforms, filters, onFiltersChange, className = '' }: FilterPanelProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const update = (patch: Partial<DashboardFilters>) => {
    onFiltersChange({ ...filters, ...patch })
  }

  const categoriesFromData = Array.from(
    new Set(evaluations.map((e) => getCategoryForPlatform(e.meta.platform_slug, platforms)))
  ).sort()
  const focusFromData = Array.from(
    new Set(evaluations.flatMap((e) => e.identity?.primary_agricultural_focus ?? []))
  ).filter(Boolean).sort()

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Search</span>
          <input
            type="search"
            value={filters.search}
            onChange={(e) => update({ search: e.target.value })}
            placeholder="Platform, company, justification…"
            className="w-48 rounded border border-slate-300 bg-white px-2.5 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800 sm:w-56"
          />
        </label>
        <ChipFilter
          label="Category"
          options={categoriesFromData.length ? categoriesFromData : CATEGORY_OPTIONS}
          selected={filters.categories}
          onToggle={(v) => update({ categories: toggleSet(filters.categories, v) })}
        />
        <ChipFilter
          label="Focus"
          options={focusFromData.length ? focusFromData : FOCUS_OPTIONS}
          selected={filters.agriculturalFocus}
          onToggle={(v) => update({ agriculturalFocus: toggleSet(filters.agriculturalFocus, v) })}
        />
        <ChipFilter
          label="Equipment"
          options={EQUIPMENT_OPTIONS}
          selected={filters.equipment}
          onToggle={(v) => update({ equipment: toggleSet(filters.equipment, v) })}
        />
        <ChipFilter
          label="Hardware"
          options={HARDWARE_OPTIONS}
          selected={filters.hardwareDependency}
          onToggle={(v) => update({ hardwareDependency: toggleSet(filters.hardwareDependency, v) })}
        />
        <ChipFilter
          label="Price"
          options={PRICE_OPTIONS}
          selected={filters.price}
          onToggle={(v) => update({ price: toggleSet(filters.price, v) })}
        />
        <ChipFilter
          label="Data ownership"
          options={OWNERSHIP_OPTIONS}
          selected={filters.dataOwnership}
          onToggle={(v) => update({ dataOwnership: toggleSet(filters.dataOwnership, v) })}
        />
        <label className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Evidence ≥</span>
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={filters.evidenceMinPercent}
            onChange={(e) => update({ evidenceMinPercent: Number(e.target.value) })}
            className="w-20"
          />
          <span className="text-xs text-slate-600 dark:text-slate-400">{filters.evidenceMinPercent}%</span>
        </label>
      </div>
    </>
  )

  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark ${className}`}>
      <div className="hidden flex-wrap gap-4 lg:flex">{content}</div>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium dark:border-slate-600 dark:bg-slate-800"
        >
          {showMobileFilters ? 'Hide filters' : 'Filters'}
        </button>
        {showMobileFilters && <div className="mt-3 flex flex-col gap-3">{content}</div>}
      </div>
    </div>
  )
}
