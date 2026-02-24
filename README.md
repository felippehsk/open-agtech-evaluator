# Open AgTech Evaluator

Web app for **Olds College** (Alberta, Canada) course **AGT3510** — students evaluate off-the-shelf precision agriculture software. Includes an evaluation form (evidence-tagged, multi-section), dashboard with comparisons and radar charts, and optional submit-to-GitHub for storing evaluations in the repo.

- **Tech:** React 18, TypeScript, Vite, Tailwind CSS, Recharts, React Router (hash), GitHub REST API (Octokit)
- **Deploy:** Static site (e.g. GitHub Pages)

---

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:5173/** — Dashboard, **New evaluation** for the form.

On Windows if `node`/`npm` aren’t on PATH, use the helper script:

```bat
.\scripts\run-npm.bat install
.\scripts\run-npm.bat run dev
```

If `node`/`npm` aren’t found or you see install errors, try a clean reinstall: remove `node_modules` and `package-lock.json`, then run `npm install` again (or use the script above with a system Node on PATH).

---

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Aggregate evaluation data → `public/api/`, then start Vite dev server |
| `npm run build` | Aggregate data, then production build to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run aggregate` | Only run `scripts/aggregate-data.js` (copy registries, merge evaluations) |

---

## Repository layout

- **`src/`** — React app: form (identity → evidence), dashboard, layout, PAT sign-in
- **`data/registries/`** — `platforms.json` (24 platforms), optional `options.json`
- **`data/evaluations/`** — One folder per platform, JSON files per evaluation (used by aggregate script)
- **`public/api/`** — Built by aggregate: `all_evaluations.json`, `platforms.json`, `options.json` (so the app doesn’t hit GitHub API at runtime)
- **`scripts/aggregate-data.js`** — Run before dev/build; copies registries and merges all evaluation JSONs

---

## Environment (optional)

- `VITE_GITHUB_REPO_OWNER` — GitHub org/user (default: `OldsCollege`)
- `VITE_GITHUB_REPO_NAME` — Repo name (default: `open-agtech-evaluator`)

Used when submitting evaluations via GitHub (PAT with `repo` scope).

---

## Deploy to GitHub Pages

The app is set up to build and deploy as a static site on GitHub Pages.

### One-time setup

1. In your GitHub repo go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. If your default branch is `master` instead of `main`, edit [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) and change `branches: [main]` to `branches: [master]`.

### Deploying

- **Automatic:** Push (or merge) to `main` — the workflow builds the app and deploys to GitHub Pages.
- **Manual:** **Actions** → **Deploy to GitHub Pages** → **Run workflow**.

### URL

After the first successful run, the site is available at:

- **Project site:** `https://<owner>.github.io/<repo-name>/`  
  Example: `https://OldsCollege.github.io/open-agtech-evaluator/`

The app uses hash routing and a configurable base URL, so it works correctly when served from that path.

---

## Licensing & attribution

- **Code and design:** [MIT License](LICENSE)  
  © Olds College — Werklund School of Agriculture Technology

- **Evaluation data** (e.g. JSON in `data/evaluations/` and aggregated outputs): **CC BY-NC-SA 4.0** (attribution, non-commercial, share-alike). Evaluations are for educational use; they are not an endorsement of any platform.

---

## Tags / topics

**agriculture** · **precision-ag** · **agtech** · **education** · **olds-college** · **evaluation-form** · **react** · **vite** · **typescript** · **github-pages**

---

## Disclaimer

Evaluations and content are for course and educational purposes only. Olds College and contributors do not endorse any software or vendor.
