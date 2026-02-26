# Open AgTech Evaluator

<p align="center">
  <img src="icon.png" alt="Open AgTech Evaluator logo" width="120" />
</p>

**Open AgTech Evaluator** is a web app for **Olds College of Agriculture & Technology** (Alberta, Canada) course **AGT3510 - Integrating Precision Farming II**. Students evaluate off-the-shelf precision agriculture software. The app runs on **GitHub Pages**: fill the evaluation form, sign in with GitHub, and submit evaluations to this repository. The dashboard shows all evaluations and lets you compare platforms.

**Live dashboard:** [https://felippehsk.github.io/open-agtech-evaluator/](https://felippehsk.github.io/open-agtech-evaluator/)

---

## Sign in with GitHub (PAT)

To **submit** an evaluation, you must sign in using a GitHub **Personal Access Token (PAT)**. The app does not store your password; it only uses the token to create or update the evaluation file in this repo.

### How to create a PAT

1. On GitHub: click your profile picture → **Settings** → **Developer settings** (left sidebar) → **Personal access tokens** → **Tokens (classic)**.
2. Click **Generate new token (classic)**.
3. Give it a name (e.g. `Open AgTech Evaluator`), choose an expiration, and under **Scopes** check **`repo`** (full control of private repositories). For a public repo, **`public_repo`** is enough.
4. Click **Generate token**, then **copy the token** (it starts with `ghp_`). You won’t see it again.
5. In the evaluator app, click **Sign in**, paste the token, and click **Sign in**. The token is kept only in your browser (session) and is sent to GitHub only when you submit.

### Security

- Do not share your PAT or commit it. Treat it like a password.
- To revoke it later: GitHub **Settings** → **Developer settings** → **Personal access tokens** → revoke the token.

---

## Evaluation protocol & guidelines

A **downloadable protocol document** explains how to fill out the form, how to use generative AI to draft answers (then verify and enter them), and includes **all form questions** and a **ready-to-use prompt** for Gen AI.

- **In this repo:** `public/AGT3510_Evaluation_Protocol.md` (open or download from GitHub).
- **On the live site:** Use the link **“Download evaluation protocol & Gen AI prompt”** on the form page; it opens the same file from the deployed site.

The protocol covers: step-by-step workflow (Gen AI draft → verify → fill form), evidence tags, best practices, full question list, and a copy-paste prompt for ChatGPT/Claude/etc. so the AI can produce a structured draft for a chosen platform.

---

## What the evaluations cover

Each evaluation is a structured assessment of one **platform** (one software product) and is saved as a single JSON file in this repo.

### Form sections

| Section | What it captures |
|--------|-------------------|
| **Platform identity** | Platform name (from list or “Other” with custom name), version evaluated, company, country, platform type, primary agricultural focus, website. |
| **1. Data ingestion** | Supported file formats (shapefile, GeoTIFF, CSV, ISOXML, proprietary), yield monitor import, satellite/drone imagery, weather, telematics, unit system, ease of import. |
| **2A. Spatial & temporal** | Spatial/temporal filtering, multi-layer overlay, coordinate system handling. |
| **2B. Yield & agronomic** | Yield cleaning, calibration, vegetation indices, zones, VRA prescriptions, export formats, interpolation, scouting, profit/loss mapping. |
| **2C. Livestock** *(if focus includes livestock)* | Individual animal records, RFID, breeding/health/grazing/weight, traceability. |
| **2D. Greenhouse / CEA** *(if focus includes CEA)* | Climate control, irrigation/fertigation, growth stage, labour, production planning. |
| **2E. Financial** | Income/expense tracking, cost of production, profitability, accounting integration. |
| **3. Data export** | Geospatial/tabular/proprietary export, batch export, time to first map. |
| **4. Integration** | Direct integrations, API, ISOBUS, OEM compatibility, hardware dependency, ADAPT. |
| **5. Data governance** | Ownership, portability, deletion, sharing, Ag Data Transparent, storage location, security. |
| **6. Access** | Multi-user, roles, offline, mobile, storage quotas. |
| **7. Pricing** | Model, free tier, trials, educational access, contracts, cost to leave, standardized cost. |
| **8. Usability** | Onboarding, documentation, training, support channels, languages. |
| **9. Critical assessment** | Strongest/weakest capability, best/worst suited for, differentiator, recommendation, AI verification counts. |
| **10. Evidence & submit** | Source types used, doc URLs, hands-on notes, total hours; then **Submit to GitHub**. |

Every substantive answer includes an **evidence tag** (e.g. hands-on verified, documentation, third-party) and optional source URL. Some sections have an **AI hallucination check** if AI was used to pre-fill.

### Platforms

The platform list includes 24 predefined platforms (John Deere Operations Center, CNH AFS Connect, Ag Leader SMS Advanced, and others) plus **Other (specify)** so you can add a platform not on the list. Custom platform names are stored in the evaluation and can be added to the official list later. The same applies to **Other (specify)** in dropdowns: your custom text is saved and can be incorporated into the option registry for future use.

### Saving and continuing

- **Auto-save:** Progress is saved in your browser as you go. Return on the same device/browser to continue.
- **Download draft:** In section 10 you can download the current draft as a JSON file (backup or move to another device).
- **Load draft:** Upload a previously downloaded draft to restore it and keep editing.

---

## Dashboard data: pulling evaluations from GitHub

The dashboard reads **all evaluations** from `public/api/all_evaluations.json`. You can fill that file in two ways:

### 1. Local / mock data (default)

Evaluations in **`data/evaluations/`** (e.g. `data/evaluations/john-deere-ops-center/eval-2026-username.json`) are aggregated at **build** or **dev** time into `public/api/all_evaluations.json`.

- **`npm run dev`** or **`npm run build`** → runs the aggregate script → uses whatever is in `data/evaluations/`.
- Use this when developing with local or mock JSON files.

### 2. Live data from GitHub

To show **real student submissions** (from the repo’s `data/evaluations/` on GitHub), pull from the GitHub API and then build or run the app:

- **Fetch once:**  
  `npm run fetch-evals`  
  This fetches all evaluation JSON files from the repo (via GitHub API), validates them, and writes `public/api/all_evaluations.json`. Optional env: **`GITHUB_TOKEN`** for higher rate limit; **`GITHUB_REPO_OWNER`** / **`GITHUB_REPO_NAME`** to point at another repo.

- **Dev with GitHub data:**  
  `npm run dev:github`  
  Runs fetch-evals, then copies registries (e.g. `platforms.json`) and icon, then starts Vite. The dashboard and evaluation detail pages use the fetched evaluations.

- **Build for deploy with GitHub data:**  
  `npm run build:github`  
  Same as above but runs `vite build` so the built site uses the latest evaluations from GitHub.

After running **fetch-evals** or **dev:github** / **build:github**, the dashboard and comparison views use real data; no mock data is used for evaluations (registries and icon still come from local `data/registries/` and repo root).

---

## Licensing & attribution

- **Code:** [MIT License](LICENSE) — © Olds College of Agriculture & Technology.
- **Evaluation data:** [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) (Attribution-NonCommercial-ShareAlike 4.0 International). See [LICENSE-EVALUATIONS](LICENSE-EVALUATIONS) in this repo. Evaluations are for educational use and are not an endorsement of any platform.

---

## Disclaimer

Evaluations and content are for course and educational purposes only. Olds College and contributors do not endorse any software or vendor.
