import { Octokit } from '@octokit/rest'
import type { Evaluation } from '@/lib/schema'

const REPO_OWNER = import.meta.env.VITE_GITHUB_REPO_OWNER ?? 'felippehsk'
const REPO_NAME = import.meta.env.VITE_GITHUB_REPO_NAME ?? 'open-agtech-evaluator'

export async function validateToken(pat: string): Promise<{ ok: boolean; login?: string; error?: string }> {
  try {
    const octokit = new Octokit({ auth: pat })
    const { data } = await octokit.rest.users.getAuthenticated()
    return { ok: true, login: data.login ?? undefined }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return { ok: false, error: message }
  }
}

export async function commitEvaluation(pat: string, evaluation: Evaluation): Promise<{ success: boolean; url?: string; error?: string }> {
  const slug = evaluation.meta.platform_slug
  const year = new Date().getFullYear()
  const username = evaluation.meta.evaluator.replace(/[^a-zA-Z0-9_-]/g, '-')
  const path = `data/evaluations/${slug}/eval-${year}-${username}.json`

  try {
    const octokit = new Octokit({ auth: pat })
    const content = JSON.stringify(evaluation, null, 2)
    const encoded = btoa(unescape(encodeURIComponent(content)))

    let sha: string | undefined
    try {
      const { data } = await octokit.rest.repos.getContent({ owner: REPO_OWNER, repo: REPO_NAME, path })
      if (data && !Array.isArray(data) && 'sha' in data) sha = data.sha
    } catch {
      // File does not exist yet; create without sha
    }

    await octokit.rest.repos.createOrUpdateFileContents({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      path,
      message: `Add evaluation: ${evaluation.meta.platform_name} (${username})`,
      content: encoded,
      ...(sha ? { sha } : {}),
    })
    return { success: true, url: path }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return { success: false, error: message }
  }
}
