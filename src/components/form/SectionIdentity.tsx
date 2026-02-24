import { useState, useEffect } from 'react'
import { useFormState } from '@/context/FormStateContext'
import { getFieldsForSection } from '@/lib/fieldConfig'
import { FieldWithEvidence } from '@/components/shared/FieldWithEvidence'
import { InfoTip } from '@/components/shared/InfoTip'
import type { FieldResponse } from '@/lib/schema'

const DEFAULT_RESPONSE: FieldResponse = { value: null, evidence_tag: 'unknown' }
const BASE = import.meta.env.BASE_URL || '/'

interface PlatformOption {
  slug: string
  name: string
  company: string
  category: string
  country: string
}

export function SectionIdentity() {
  const { state, setSectionField, dispatch } = useFormState()
  const [platforms, setPlatforms] = useState<PlatformOption[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${BASE}api/platforms.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        setPlatforms(Array.isArray(data) ? data : [])
      })
      .catch(() => setPlatforms([]))
      .finally(() => setLoading(false))
  }, [])

  const sectionData = state.draft.sections?.identity ?? {}
  const selectedSlug = state.draft.meta?.platform_slug ?? ''
  const selectedPlatform = platforms.find((p) => p.slug === selectedSlug)
  const identityFields = getFieldsForSection('identity')

  const isOther = selectedSlug === 'other'
  const customPlatformName = (isOther && state.draft.meta?.platform_name) || ''

  /** Auto-fill company and country from platform registry when we have a known platform. */
  function applyPlatformToIdentity(platform: PlatformOption) {
    if (!platform || platform.slug === 'other') return
    dispatch({
      type: 'SET_IDENTITY',
      payload: {
        company_developer: platform.company,
        country_of_origin: platform.country,
      },
    })
    setSectionField('identity', 'company_developer', { value: platform.company, evidence_tag: 'documentation_verified' })
    setSectionField('identity', 'country_of_origin', { value: platform.country, evidence_tag: 'documentation_verified' })
  }

  // When platforms load: if we have a slug but identity fields are empty, fill from registry. If we have platform_name but no slug, resolve and fill.
  useEffect(() => {
    if (loading || platforms.length === 0) return
    const slug = state.draft.meta?.platform_slug ?? ''
    const name = (state.draft.meta?.platform_name ?? '').trim()
    const companyVal = sectionData.company_developer?.value
    const countryVal = sectionData.country_of_origin?.value
    const companyEmpty = companyVal == null || (typeof companyVal === 'string' && !companyVal.trim())
    const countryEmpty = countryVal == null || (typeof countryVal === 'string' && !countryVal.trim())

    if (slug && slug !== 'other') {
      const bySlug = platforms.find((p) => p.slug === slug)
      if (bySlug && (companyEmpty || countryEmpty)) applyPlatformToIdentity(bySlug)
      return
    }
    if (name) {
      const byName = platforms.find((p) => p.name.trim().toLowerCase() === name.toLowerCase())
      if (byName) {
        dispatch({ type: 'SET_META', payload: { platform_slug: byName.slug, platform_name: byName.name } })
        applyPlatformToIdentity(byName)
      }
    }
  }, [loading, platforms, state.draft.meta?.platform_slug, state.draft.meta?.platform_name])

  function handlePlatformChange(slug: string) {
    const platform = platforms.find((p) => p.slug === slug)
    dispatch({ type: 'SET_META', payload: { platform_slug: slug || undefined, platform_name: platform?.name ?? undefined } })
    if (platform && platform.slug !== 'other') {
      applyPlatformToIdentity(platform)
    } else if (platform?.slug === 'other') {
      dispatch({ type: 'SET_IDENTITY', payload: { company_developer: undefined, country_of_origin: undefined } })
      setSectionField('identity', 'company_developer', { value: '', evidence_tag: 'unknown' })
      setSectionField('identity', 'country_of_origin', { value: '', evidence_tag: 'unknown' })
    }
  }

  function handleOtherPlatformName(name: string) {
    dispatch({ type: 'SET_META', payload: { platform_name: name || undefined } })
  }

  return (
    <div className="space-y-6">
      <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
        Platform identity
        <InfoTip text="Select the software platform you are evaluating. For listed platforms, company and country are filled automatically. Choose “Other” to evaluate a platform not in the list." placement="bottom" />
      </h3>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Platform</label>
        <select
          value={selectedSlug}
          onChange={(e) => handlePlatformChange(e.target.value)}
          disabled={loading}
          className="mt-1 w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
        >
          <option value="">Select platform…</option>
          {platforms.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name} — {p.company}
            </option>
          ))}
        </select>
        {selectedPlatform && !isOther && (
          <p className="mt-1 text-xs text-slate-500">
            {selectedPlatform.category} • {selectedPlatform.country}
          </p>
        )}
        {isOther && (
          <div className="mt-3 space-y-2">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Specify platform name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customPlatformName}
              onChange={(e) => handleOtherPlatformName(e.target.value)}
              placeholder="e.g. Acme Farm Software"
              className="w-full max-w-md rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            />
            <p className="text-xs text-slate-500">
              Company and country can be entered in the fields below.
            </p>
          </div>
        )}
      </div>

      {identityFields.map((config) => {
        const current = sectionData[config.key]
        const value: FieldResponse = current ?? { ...DEFAULT_RESPONSE, value: config.type === 'multi_select' ? [] : null }
        return (
          <FieldWithEvidence
            key={config.key}
            config={config}
            sectionKey="identity"
            value={value}
            onChange={(response) => setSectionField('identity', config.key, response)}
          />
        )
      })}
    </div>
  )
}
