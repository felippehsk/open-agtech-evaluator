import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Evaluation, FieldResponse } from '@/lib/schema'
import { SECTION_KEYS } from '@/lib/schema'
import { SECTION_DISPLAY_TITLES } from '@/lib/sectionTitles'
import { SECTION_FIELDS } from '@/lib/fieldConfig'
import { calculateSectionScore } from '@/lib/scoring'
import {
  getOverallScore,
  getEvidenceQuality,
  getTotalFieldsAnswered,
  getHardwareDependency,
  getAnnualCostBroadacre,
  getADTCertified,
  getBestSuitedFor,
  getAIAccuracyBySection,
} from '@/lib/dashboardUtils'
import { EvidenceDistribution } from '@/components/dashboard/EvidenceDistribution'

const BASE = import.meta.env.BASE_URL || '/'

function evaluatorToSlug(evaluator: string): string {
  return evaluator.replace(/[^a-zA-Z0-9_-]/g, '-')
}

function formatFieldValue(fr: FieldResponse | undefined): string {
  if (!fr) return '—'
  const v = fr.value
  if (v == null) return '—'
  if (Array.isArray(v)) return v.length ? v.join(', ') : '—'
  if (typeof v === 'string') return v.trim() || '—'
  if (typeof v === 'number') return String(v)
  if (typeof v === 'boolean') return v ? 'Yes' : 'No'
  return '—'
}

const EVIDENCE_TAG_LABELS: Record<string, string> = {
  hands_on_verified: 'Hands-on verified',
  documentation_verified: 'Documentation verified',
  third_party_verified: 'Third-party verified',
  vendor_claimed: 'Vendor-claimed',
  unknown: 'Unknown',
  not_applicable: 'N/A',
}

const AI_BADGE: Record<string, { label: string; className: string }> = {
  correct: { label: 'AI correct', className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300' },
  minor: { label: 'AI minor errors', className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' },
  major: { label: 'AI major errors', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
  hallucinated: { label: 'AI hallucinated', className: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' },
  not_used: { label: 'AI not used', className: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
}

export function EvaluationDetailPage() {
  const { platformSlug, evaluatorId } = useParams<{ platformSlug: string; evaluatorId: string }>()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [sectionExpanded, setSectionExpanded] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetch(`${BASE}api/all_evaluations.json`)
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setEvaluations(Array.isArray(data) ? data : []))
      .catch(() => setEvaluations([]))
      .finally(() => setLoading(false))
  }, [])

  const evaluation =
    platformSlug != null && evaluatorId != null
      ? evaluations.find(
          (e) => e.meta.platform_slug === platformSlug && evaluatorToSlug(e.meta.evaluator) === evaluatorId
        ) ?? null
      : null

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-slate-500 dark:text-slate-400">Loading…</p>
      </div>
    )
  }

  if (!evaluation) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <p className="text-slate-600 dark:text-slate-400">Evaluation not found.</p>
        <Link to="/" className="mt-4 inline-block font-medium text-primary hover:underline">Back to dashboard</Link>
      </div>
    )
  }

  const { meta, identity, sections = {}, assessment, evidence_log } = evaluation
  const scoreSections = ['ingestion', 'processing_2a', 'processing_2b', 'export', 'integration', 'governance', 'access', 'pricing', 'usability'] as const
  const sectionScores = scoreSections.map((key) => {
    const sec = sections[key]
    const s = sec ? calculateSectionScore(sec) : { evidence_weighted_score: 0 }
    return { key, label: SECTION_DISPLAY_TITLES[key] ?? key, score: Math.round(s.evidence_weighted_score * 100) }
  })
  const overallScore = getOverallScore(evaluation)
  const evidence = getEvidenceQuality(evaluation)
  const fieldsCount = getTotalFieldsAnswered(evaluation)
  const hardware = getHardwareDependency(evaluation)
  const costBroadacre = getAnnualCostBroadacre(evaluation)
  const adt = getADTCertified(evaluation)
  const bestFor = getBestSuitedFor(evaluation)
  const aiTotal = assessment?.ai_claims_total ?? 0
  const aiCorrect = assessment?.ai_claims_correct ?? 0
  const aiIncorrect = assessment?.ai_claims_incorrect ?? 0
  const aiUnverifiable = assessment?.ai_claims_unverifiable ?? 0
  const aiBySection = getAIAccuracyBySection(evaluation)

  const setSectionExpandedKey = (key: string, value: boolean) => {
    setSectionExpanded((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <Link to="/" className="text-sm font-medium text-primary hover:underline">← Dashboard</Link>

      {/* Platform overview card */}
      <div className="mb-8 mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">{meta.platform_name}</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {identity?.company_developer ?? '—'} • {identity?.country_of_origin ?? '—'} • {(identity?.platform_type ?? []).join(', ') || '—'}
        </p>
        <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          Version evaluated: {identity?.version_module_evaluated ?? '—'}
        </p>
        {identity?.website_url && (
          <a href={identity.website_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm text-primary hover:underline">
            {identity.website_url}
          </a>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Score</p>
            <p className="text-xl font-bold text-primary">{overallScore}%</p>
            <p className="text-xs text-slate-500">overall</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Evidence</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{evidence.percent}%</p>
            <p className="text-xs text-slate-500">verified</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Fields</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{fieldsCount.answered}/{fieldsCount.total}</p>
            <p className="text-xs text-slate-500">answered</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Hours</p>
            <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{meta.total_hours_spent ?? '—'}</p>
            <p className="text-xs text-slate-500">spent</p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
          {hardware === 'independent' && <span>🔓 Software-independent</span>}
          {hardware === 'enhanced' && <span>🔒 Enhanced by hardware</span>}
          {hardware === 'locked' && <span>🔒 Locked to hardware</span>}
          {costBroadacre !== null && <span>💰 {costBroadacre === 0 ? '$0 (free)' : `$${costBroadacre.toLocaleString()}/yr (2,000 ac grain)`}</span>}
          {adt ? <span>🇨🇦 ADT Certified</span> : <span>📋 Not ADT Certified</span>}
          {assessment?.recommendation && <span>⭐ {assessment.recommendation}</span>}
        </div>

        {bestFor.length > 0 && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            <span className="font-medium">Best for:</span> {bestFor.join(', ')}
          </p>
        )}
        {(assessment?.strongest_capability || assessment?.weakest_capability) && (
          <div className="mt-2 flex flex-wrap gap-4 text-sm">
            {assessment.strongest_capability && (
              <p><span className="font-medium text-slate-500 dark:text-slate-400">Strongest:</span> {assessment.strongest_capability}</p>
            )}
            {assessment.weakest_capability && (
              <p><span className="font-medium text-slate-500 dark:text-slate-400">Weakest:</span> {assessment.weakest_capability}</p>
            )}
          </div>
        )}
        {(aiTotal > 0 || aiCorrect > 0 || aiIncorrect > 0 || aiUnverifiable > 0) && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            AI verification: {aiTotal} claims — {aiCorrect} correct, {aiIncorrect} incorrect, {aiUnverifiable} unverifiable.
          </p>
        )}
      </div>

      {/* Section scores bar */}
      <div className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Section scores</h2>
        <div className="space-y-3">
          {sectionScores.map(({ key, label, score }) => (
            <div key={key} className="flex items-center gap-4">
              <span className="w-36 shrink-0 text-sm text-slate-600 dark:text-slate-400">{label}</span>
              <div className="h-6 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="w-10 text-right text-sm font-medium text-slate-900 dark:text-slate-100">{score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Meta & identity */}
      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Evaluation meta</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="font-medium text-slate-500 dark:text-slate-400">Cohort</dt><dd className="text-slate-900 dark:text-slate-100">{meta.cohort}</dd></div>
            <div><dt className="font-medium text-slate-500 dark:text-slate-400">Total hours</dt><dd className="text-slate-900 dark:text-slate-100">{meta.total_hours_spent}</dd></div>
          </dl>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-slate-100">Platform identity</h2>
          <dl className="space-y-2 text-sm">
            <div><dt className="font-medium text-slate-500 dark:text-slate-400">Company</dt><dd className="text-slate-900 dark:text-slate-100">{identity?.company_developer || '—'}</dd></div>
            <div><dt className="font-medium text-slate-500 dark:text-slate-400">Country</dt><dd className="text-slate-900 dark:text-slate-100">{identity?.country_of_origin || '—'}</dd></div>
            <div><dt className="font-medium text-slate-500 dark:text-slate-400">Website</dt><dd className="text-slate-900 dark:text-slate-100">{identity?.website_url ? <a href={identity.website_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{identity.website_url}</a> : '—'}</dd></div>
            <div><dt className="font-medium text-slate-500 dark:text-slate-400">Platform type</dt><dd className="text-slate-900 dark:text-slate-100">{(identity?.platform_type ?? []).join(', ') || '—'}</dd></div>
            <div><dt className="font-medium text-slate-500 dark:text-slate-400">Primary focus</dt><dd className="text-slate-900 dark:text-slate-100">{(identity?.primary_agricultural_focus ?? []).join(', ') || '—'}</dd></div>
          </dl>
        </div>
      </div>

      {/* Sections (form data) */}
      {SECTION_KEYS.filter((sk) => sk !== 'identity' && sk !== 'evidence').map((sectionKey) => {
        const sectionData = sections[sectionKey]
        const fieldConfigs = SECTION_FIELDS[sectionKey] ?? []
        if (!sectionData || !Object.keys(sectionData).length) return null
        const title = SECTION_DISPLAY_TITLES[sectionKey] ?? sectionKey
        const expanded = sectionExpanded[sectionKey] !== false
        const fieldList = Object.values(sectionData) as (FieldResponse | undefined)[]
        const aiStatus = aiBySection[sectionKey]
        const aiBadge = aiStatus ? AI_BADGE[aiStatus] : null
        return (
          <div key={sectionKey} className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
            <button
              type="button"
              onClick={() => setSectionExpandedKey(sectionKey, !expanded)}
              className="flex w-full flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-5 py-4 text-left dark:border-slate-600"
            >
              <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</span>
              <span className="flex items-center gap-2">
                <EvidenceDistribution fields={fieldList} maxDots={10} className="shrink-0" />
                {aiBadge && (
                  <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${aiBadge.className}`}>{aiBadge.label}</span>
                )}
                <span className="text-slate-400" aria-hidden>{expanded ? '▼' : '▶'}</span>
              </span>
            </button>
            {expanded && (
              <dl className="divide-y divide-slate-100 dark:divide-slate-700">
                {fieldConfigs.map((fc) => {
                  const fr = sectionData[fc.key]
                  const value = formatFieldValue(fr)
                  if (value === '—' && !fr?.notes && !fr?.source_url) return null
                  const tagLabel = fr ? EVIDENCE_TAG_LABELS[fr.evidence_tag] ?? fr.evidence_tag : null
                  return (
                    <div key={fc.key} className="px-5 py-3">
                      <dt className="text-sm font-medium text-slate-500 dark:text-slate-400">{fc.label}</dt>
                      <dd className="mt-0.5 text-slate-900 dark:text-slate-100">{value}</dd>
                      {(fr?.notes || fr?.source_url || tagLabel) && (
                        <dd className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
                          {tagLabel && <span>{tagLabel}</span>}
                          {fr?.source_url && <a href={fr.source_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Source</a>}
                          {fr?.notes && <span>Note: {fr.notes}</span>}
                        </dd>
                      )}
                    </div>
                  )
                })}
              </dl>
            )}
          </div>
        )
      })}

      {/* Assessment */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Critical assessment</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Strongest capability</p>
            <p className="text-slate-900 dark:text-slate-100">{assessment?.strongest_capability || '—'}</p>
            {assessment?.strongest_capability_justification && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{assessment.strongest_capability_justification}</p>}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Weakest capability</p>
            <p className="text-slate-900 dark:text-slate-100">{assessment?.weakest_capability || '—'}</p>
            {assessment?.weakest_capability_justification && <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{assessment.weakest_capability_justification}</p>}
          </div>
        </div>
        <div className="mt-4 space-y-2 text-sm">
          <p><span className="font-medium text-slate-500 dark:text-slate-400">Best suited for:</span> {(assessment?.best_suited_for ?? []).join(', ') || '—'}</p>
          <p><span className="font-medium text-slate-500 dark:text-slate-400">Worst suited for:</span> {assessment?.worst_suited_for || '—'}</p>
          <p><span className="font-medium text-slate-500 dark:text-slate-400">Unique differentiator:</span> {assessment?.unique_differentiator || '—'}</p>
          <p><span className="font-medium text-slate-500 dark:text-slate-400">Recommendation:</span> {assessment?.recommendation || '—'}</p>
        </div>
      </div>

      {/* Evidence log */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">Evidence log</h2>
        <div className="space-y-3 text-sm">
          <p><span className="font-medium text-slate-500 dark:text-slate-400">Source types:</span> {(evidence_log?.source_types_used ?? []).join(', ') || '—'}</p>
          {(() => {
            const urls = evidence_log?.official_doc_urls
            const urlList = Array.isArray(urls) ? urls : typeof urls === 'string' ? urls.split(/\n/).map((s) => s.trim()).filter(Boolean) : []
            return urlList.length ? (
              <div>
                <p className="font-medium text-slate-500 dark:text-slate-400">Official doc URLs</p>
                <ul className="mt-1 list-inside list-disc text-slate-700 dark:text-slate-300">
                  {urlList.map((url, i) => (
                    <li key={i}><a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{url}</a></li>
                  ))}
                </ul>
              </div>
            ) : null
          })()}
          {evidence_log?.hands_on_notes && <p><span className="font-medium text-slate-500 dark:text-slate-400">Hands-on notes:</span> {evidence_log.hands_on_notes}</p>}
        </div>
      </div>
    </div>
  )
}
