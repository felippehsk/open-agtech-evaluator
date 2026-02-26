/**
 * Build-time aggregation script for AGT3510 evaluations.
 * Reads all JSON files in data/evaluations/ (recursive) and writes
 * public/api/all_evaluations.json. This avoids hitting the GitHub API
 * rate limit when the dashboard loads (60 req/hr unauthenticated).
 *
 * Run before Vite build: npm run build or npm run dev
 * Use --skip-evals to skip evaluation aggregation (e.g. after fetch-evals from GitHub).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const EVAL_DIR = path.join(ROOT, 'data', 'evaluations');
const OUTPUT_DIR = path.join(ROOT, 'public', 'api');

const SKIP_EVALS = process.argv.includes('--skip-evals');

function findEvalFiles(dir) {
  const files = [];
  if (!fs.existsSync(dir)) {
    return files;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findEvalFiles(fullPath));
    } else if (entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

let allEvaluations = [];
if (!SKIP_EVALS) {
  const evalFiles = findEvalFiles(EVAL_DIR);
  for (const filePath of evalFiles) {
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(raw);
      if (data && data.meta && data.meta.schema_version) {
        allEvaluations.push(data);
      } else {
        console.warn(`[aggregate-data] Skipping ${path.relative(ROOT, filePath)}: missing meta.schema_version`);
      }
    } catch (err) {
      console.error(`[aggregate-data] Error reading ${path.relative(ROOT, filePath)}:`, err.message);
    }
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'all_evaluations.json'), JSON.stringify(allEvaluations, null, 2), 'utf-8');
  console.log(`[aggregate-data] Aggregated ${allEvaluations.length} evaluations → public/api/all_evaluations.json`);
} else {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log('[aggregate-data] Skipped evaluation aggregation (--skip-evals).');
}

const REGISTRIES = ['platforms.json', 'options.json'];
const REG_DIR = path.join(ROOT, 'data', 'registries');
for (const name of REGISTRIES) {
  const src = path.join(REG_DIR, name);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(OUTPUT_DIR, name));
    console.log(`[aggregate-data] Copied ${name} → public/api/`);
  }
}

// Single source of truth: icon at repo root. Copy to public/ so the app and favicon work.
const ROOT_ICON = path.join(ROOT, 'icon.png');
const PUBLIC_ICON = path.join(ROOT, 'public', 'icon.png');
if (fs.existsSync(ROOT_ICON)) {
  fs.copyFileSync(ROOT_ICON, PUBLIC_ICON);
  console.log('[aggregate-data] Copied icon.png (root) → public/icon.png');
}
