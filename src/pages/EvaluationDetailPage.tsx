import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import type { Evaluation, FieldResponse } from '@/lib/schema'
import { SECTION_KEYS } from '@/lib/schema'
import { SECTION_DISPLAY_TITLES } from '@/lib/sectionTitles'
import { SECTION_FIELDS } from '@/lib/fieldConfig'
import { calculateSectionScore } from '@/lib/scoring'

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

export function EvaluationDetailPage() {
  const { platformSlug, evaluatorId } = useParams<{ platformSlug: string; evaluatorId: string }>()
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

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
  const overallScore = sectionScores.length ? Math.round(sectionScores.reduce((a, b) => a + b.score, 0) / sectionScores.length) : 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link to="/" className="text-sm font-medium text-primary hover:underline">← Dashboard</Link>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {meta.platform_name}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {meta.evaluator} • {meta.evaluation_date}
            {identity?.version_module_evaluated && ` • ${identity.version_module_evaluated}`}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Overall score</span>
          <p className="text-2xl font-bold text-primary">{overallScore}%</p>
        </div>
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
        return (
          <div key={sectionKey} className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark">
            <h2 className="border-b border-slate-200 px-5 py-4 text-lg font-semibold text-slate-900 dark:border-slate-600 dark:text-slate-100">{title}</h2>
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
