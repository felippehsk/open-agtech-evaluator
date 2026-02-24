import { useState } from 'react'
import { validateToken } from '@/lib/github'

const PAT_STORAGE_KEY = 'agt3510_github_pat'
const USERNAME_STORAGE_KEY = 'agt3510_github_username'

export function getStoredPat(): string | null {
  try {
    return sessionStorage.getItem(PAT_STORAGE_KEY)
  } catch {
    return null
  }
}

export function getStoredUsername(): string | null {
  try {
    return sessionStorage.getItem(USERNAME_STORAGE_KEY)
  } catch {
    return null
  }
}

interface PATModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (username: string) => void
}

export function PATModal({ open, onClose, onSuccess }: PATModalProps) {
  const [pat, setPat] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!pat.trim()) {
      setError('Enter a Personal Access Token.')
      return
    }
    setLoading(true)
    const result = await validateToken(pat.trim())
    setLoading(false)
    if (result.ok && result.login) {
      try {
        sessionStorage.setItem(PAT_STORAGE_KEY, pat.trim())
        sessionStorage.setItem(USERNAME_STORAGE_KEY, result.login)
      } catch {
        // ignore
      }
      onSuccess(result.login)
      setPat('')
      onClose()
    } else {
      setError(result.error ?? 'Invalid token.')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-800">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Sign in with GitHub</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Use a Personal Access Token (classic) with <code className="rounded bg-slate-200 px-1 dark:bg-slate-700">repo</code> scope to submit evaluations.
        </p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="password"
            value={pat}
            onChange={(e) => setPat(e.target.value)}
            placeholder="ghp_…"
            className="w-full rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            autoComplete="off"
          />
          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50">
              {loading ? 'Checking…' : 'Sign in'}
            </button>
            <button type="button" onClick={onClose} className="rounded border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
