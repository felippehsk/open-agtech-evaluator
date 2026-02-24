import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link } from 'react-router-dom'

const BASE = import.meta.env.BASE_URL || '/'
const PROTOCOL_URL = `${BASE}AGT3510_Evaluation_Protocol.md`

export function ProtocolPage() {
  const [markdown, setMarkdown] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(PROTOCOL_URL)
      .then((r) => {
        if (!r.ok) throw new Error('Could not load protocol.')
        return r.text()
      })
      .then(setMarkdown)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-slate-500 dark:text-slate-400">Loading protocol…</p>
      </div>
    )
  }

  if (error || !markdown) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-red-600 dark:text-red-400">{error ?? 'Protocol not found.'}</p>
        <Link to="/form" className="mt-4 inline-block text-primary hover:underline">Back to form</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link to="/form" className="text-sm font-medium text-primary hover:underline">← Back to form</Link>
        <a
          href={PROTOCOL_URL}
          download="AGT3510_Evaluation_Protocol.md"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Download as .md
        </a>
      </div>
      <article className="protocol-content rounded-2xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-600 dark:bg-slate-800/80 dark:shadow-soft-dark sm:p-8 [&_h1]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:border-b [&_h2]:border-slate-200 [&_h2]:pb-2 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:dark:border-slate-600 [&_h3]:mb-2 [&_h3]:mt-6 [&_h3]:text-base [&_h3]:font-semibold [&_p]:my-3 [&_p]:text-slate-700 [&_p]:leading-relaxed [&_p]:dark:text-slate-300 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_li]:my-1 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-slate-200 [&_th]:bg-slate-100 [&_th]:px-4 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm [&_th]:font-semibold [&_th]:dark:border-slate-600 [&_th]:dark:bg-slate-700 [&_td]:border [&_td]:border-slate-200 [&_td]:px-4 [&_td]:py-2 [&_td]:text-sm [&_td]:dark:border-slate-600 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-slate-900 [&_pre]:p-4 [&_pre]:text-sm [&_pre]:text-slate-100 [&_code]:rounded [&_code]:bg-slate-100 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:dark:bg-slate-700 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_hr]:my-8 [&_hr]:border-slate-200 [&_hr]:dark:border-slate-600 [&_strong]:font-semibold">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {markdown}
        </ReactMarkdown>
      </article>
    </div>
  )
}
