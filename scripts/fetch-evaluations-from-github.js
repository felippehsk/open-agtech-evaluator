/**
 * Fetches all evaluation JSON files from the GitHub repo (data/evaluations/.../*.json),
 * parses and validates them, then writes public/api/all_evaluations.json.
 * Use this to pull real student submissions into the dashboard without cloning the repo.
 *
 * Optional: GITHUB_TOKEN env for higher rate limit (5000/hr vs 60/hr unauthenticated).
 * Optional: GITHUB_REPO_OWNER, GITHUB_REPO_NAME (default: felippehsk, open-agtech-evaluator).
 *
 * Run: node scripts/fetch-evaluations-from-github.js
 * Or before build: npm run fetch-evals && npm run build
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const OUTPUT_DIR = path.join(ROOT, 'public', 'api')
const EVAL_PREFIX = 'data/evaluations/'

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || process.env.VITE_GITHUB_REPO_OWNER || 'felippehsk'
const REPO_NAME = process.env.GITHUB_REPO_NAME || process.env.VITE_GITHUB_REPO_NAME || 'open-agtech-evaluator'
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN

async function getDefaultBranch() {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`
  const res = await fetch(url, {
    headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {},
  })
  if (!res.ok) throw new Error(`Repo fetch failed: ${res.status} ${res.statusText}`)
  const data = await res.json()
  return data.default_branch || 'main'
}

/** Get full tree (recursive) for the repo. */
async function getTreeRecursive(ref) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/git/trees/${ref}?recursive=1`
  const res = await fetch(url, {
    headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {},
  })
  if (!res.ok) throw new Error(`Tree fetch failed: ${res.status} ${res.statusText}`)
  const data = await res.json()
  return data.tree || []
}

/** Get file content by path (Contents API returns base64). */
async function getFileContent(filePath) {
  const encodedPath = filePath.split('/').map((p) => encodeURIComponent(p)).join('/')
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodedPath}`
  const res = await fetch(url, {
    headers: GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {},
  })
  if (!res.ok) return null
  const data = await res.json()
  if (!data.content || data.encoding !== 'base64') return null
  return Buffer.from(data.content, 'base64').toString('utf-8')
}

function isValidEvaluation(obj) {
  return obj && typeof obj === 'object' && obj.meta && obj.meta.schema_version
}

async function main() {
  console.log(`[fetch-evals] Fetching evaluations from ${REPO_OWNER}/${REPO_NAME} ...`)
  const ref = await getDefaultBranch()
  const tree = await getTreeRecursive(ref)
  const evalPaths = tree
    .filter((e) => e.type === 'blob' && e.path.startsWith(EVAL_PREFIX) && e.path.endsWith('.json'))
    .map((e) => e.path)
  console.log(`[fetch-evals] Found ${evalPaths.length} evaluation file(s).`)
  const allEvaluations = []
  for (const filePath of evalPaths) {
    try {
      const raw = await getFileContent(filePath)
      if (!raw) {
        console.warn(`[fetch-evals] No content: ${filePath}`)
        continue
      }
      const data = JSON.parse(raw)
      if (isValidEvaluation(data)) {
        allEvaluations.push(data)
      } else {
        console.warn(`[fetch-evals] Skipping ${filePath}: missing meta.schema_version`)
      }
    } catch (err) {
      console.error(`[fetch-evals] Error ${filePath}:`, err.message)
    }
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const outPath = path.join(OUTPUT_DIR, 'all_evaluations.json')
  fs.writeFileSync(outPath, JSON.stringify(allEvaluations, null, 2), 'utf-8')
  console.log(`[fetch-evals] Wrote ${allEvaluations.length} evaluations → public/api/all_evaluations.json`)
}

main().catch((err) => {
  console.error('[fetch-evals]', err)
  process.exit(1)
})
