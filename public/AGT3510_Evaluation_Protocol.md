# AGT3510 Evaluation Protocol & Guidelines

**Olds College of Agriculture & Technology**  
This document explains how to complete a platform evaluation: use generative AI to draft answers, then verify and enter them in the online form.

---

## 1. Purpose

Each evaluation is a structured assessment of one precision-ag software platform. The form captures **what the platform can do** (data ingestion, processing, export, integration, governance, etc.) and **how you know** (evidence tags and sources). Evaluations are submitted to the course repository and used for comparison and learning. **You must verify every substantive answer** with your own research or hands-on testing before submitting.

---

## 2. Step-by-step protocol

| Step | What to do |
|------|------------|
| **1. Choose your platform** | Pick one platform from the class list (e.g. Ag Leader SMS Advanced, Climate FieldView, AgriWebb). |
| **2. Get the Gen AI prompt** | Open this document and go to **Section 7 (Prompt for generative AI)** below. Copy only the prompt block from that section — you do not need to give the AI the full document. |
| **3. Run the Gen AI prompt** | Open your preferred generative AI tool (e.g. ChatGPT, Claude, Copilot). Paste the prompt from **Section 7** below and replace `[PLATFORM NAME]` with your platform. Run the prompt and save the AI’s response as a **draft**. |
| **4. Treat the draft as a starting point** | The AI may be wrong or outdated. Do **not** copy answers into the form without checking. |
| **5. Verify each answer** | For every question: find the information yourself using official documentation, a trial account, or a trusted third-party source. Note where you found it (URL or source type). |
| **6. Test when possible** | If you have access to a trial or demo, try the feature (e.g. “Does it import Shapefile?”) and confirm. Mark those answers as **hands-on verified**. |
| **7. Fill out the online form** | Open the evaluation app, select your platform, and work through each section. Enter only answers you have verified. For each answer, choose the correct **evidence tag** and add a **source URL** if you have one. |
| **8. Complete evidence & submit** | In section 10, list source types used, official doc URLs, hands-on notes, and total hours. Sign in with GitHub (PAT) and submit. Use **Download draft** periodically to back up your work. |

---

## 3. Guidelines for filling out the form

- **One platform per evaluation.** If you have multiple platforms, submit one evaluation per platform.
- **Version matters.** Always record the exact version, module, or tier you evaluated (e.g. “Operations Center — free tier, Feb 2026”).
- **Use the evidence tag on every substantive answer.** Choose the tag that best reflects how you verified that answer (see Section 4). Do not leave answers as “Unknown” unless you truly could not determine the answer after research.
- **Add a source URL when you can.** For documentation or web sources, paste the URL in the “Source URL” field so reviewers can check.
- **Sections 2C (Livestock) and 2D (Greenhouse/CEA)** appear only when your chosen “Primary agricultural focus” includes livestock or CEA. If they don’t apply to your platform, they will be hidden; you don’t need to do anything.
- **Save your work.** The form auto-saves in your browser. Use **Download draft** (section 10) to back up or move to another device; use **Load draft** to restore.
- **AI hallucination check.** If you used AI to draft answers for a section, after verifying you must select one of the AI check options for that section (e.g. “AI was 100% correct” or “AI made significant errors”). This helps the course track AI reliability.

---

## 4. Evidence tags (choose one per answer)

| Tag | When to use |
|-----|-------------|
| **Hands-on verified** | You tested this yourself in the platform (trial, demo, or real use). |
| **Documentation verified** | You confirmed via official help, docs, or knowledge base. |
| **Third-party verified** | You confirmed via independent review, article, or academic source. |
| **Vendor-claimed** | Your only source is marketing or vendor materials (no independent check). |
| **Unknown** | You could not find or confirm this after reasonable research. |
| **N/A — Out of scope** | This feature does not apply to this platform type (e.g. livestock question on a crop-only tool). |

Use **Unknown** sparingly; prefer **Vendor-claimed** if the only source is the vendor, and say so in notes or source URL.

---

## 5. All questions by section

Below is a concise list of every question on the form. Use it as a checklist when verifying. For dropdown and multi-select questions, the exact options are in the **online form** and in the **Gen AI prompt** (Section 7).

### Platform identity
- Version / module evaluated (text)
- Company / developer (text)
- Country of origin (dropdown)
- Year founded / launched (text)
- Platform type (multi-select: Web-based, Desktop Windows/Mac, Mobile iOS/Android, Hybrid, API-only, Plugin)
- Primary agricultural focus (multi-select: Broadacre, Row crops, Specialty, Livestock types, CEA, Mixed, Sector-agnostic)
- Website URL (url)
- Last updated / version (text)

### 1. Data ingestion
- Open / standard geospatial formats (multi-select: Shapefile, GeoJSON, GeoTIFF, KML, GeoPackage, CSV coords, ISOXML, WKT)
- Proprietary machine data formats (multi-select: John Deere, CNH, AGCO, Ag Leader, Trimble, etc., or Not supported)
- Yield monitor data import — supported brands (multi-select)
- Satellite imagery integration (multi-select)
- Drone / UAV imagery import (multi-select)
- Weather data integration (multi-select)
- Direct machine / telematics connection (multi-select)
- Ease of import 1–5 (rating)
- Unit system handling (dropdown: Imperial/Metric/Canadian mixed, etc.)
- Data format limitations or issues noted (textarea)

### 2A. Spatial & temporal handling
- Spatial filtering capabilities (multi-select)
- Temporal filtering capabilities (multi-select)
- Multi-layer overlay capabilities (multi-select)
- Coordinate reference system handling (dropdown)

### 2B. Yield & agronomic processing
- Yield data cleaning capabilities (multi-select)
- Combine calibration adjustment (multi-select)
- Yield map generation (Yes/No/Partial)
- Vegetation index calculation (multi-select)
- Management zone delineation (multi-select)
- VRA prescription map creation (multi-select)
- Prescription export formats (multi-select)
- Interpolation methods (multi-select)
- On-farm trial / strip trial analysis (multi-select)
- Profit / loss map generation (multi-select)
- Crop scouting tools (multi-select)

### 2C. Livestock-specific (if applicable)
- Individual animal records (single select)
- RFID / EID integration (multi-select)
- Breeding & genetics tracking, Health & treatment records, Grazing management, Weight / growth tracking (Yes/No/Partial/N/A)
- Traceability birth to harvest (multi-select)

### 2D. Greenhouse / CEA (if applicable)
- Climate control monitoring (multi-select)
- Irrigation / fertigation management, Crop growth stage tracking, Labor / task management, Production planning (Yes/No/Partial/N/A)

### 2E. Financial processing
- Income tracking, Expense tracking, Cost of production, Profitability analysis (Yes/No/Partial)
- Cost tracking granularity, Integration with accounting software (multi-select)

### 3. Data export
- Data export — geospatial formats (multi-select)
- Data export — tabular/report formats (multi-select)
- Data export — proprietary / other (multi-select)
- Batch export capability (dropdown)
- Time to first map (dropdown)
- Report generation (multi-select)

### 4. Integration & interoperability
- Direct platform integrations (multi-select)
- API availability (dropdown)
- ISOBUS / ISO 11783 compliance (dropdown)
- OEM equipment compatibility (multi-select)
- Data format interoperability 1–5 (rating)
- Hardware dependency (dropdown)
- AgGateway ADAPT framework support (dropdown)

### 5. Data governance
- Data ownership policy, Data portability, Data deletion policy, Data sharing (dropdowns)
- Ag Data Transparent certified (dropdown)
- Privacy policy URL (url)
- Data storage location, Security measures (multi-select)

### 6. Access & multi-user
- Multi-user access, User roles, Sharing with advisors, Offline functionality, Mobile app, Storage quotas (dropdown/multi-select)

### 7. Pricing
- Pricing model, Free tier, Free tier limitations, Trial period, Educational pricing, Contract requirements (dropdown/multi-select)
- Standardized cost (broadacre 2,000 ac; livestock 500 head): currency, annual $, notes
- Cost to leave (dropdown)

### 8. Usability & support
- Onboarding / setup 1–5 (rating), Documentation quality, Training resources, Support channels, Support languages (dropdown/multi-select)
- Update frequency (text)

### 9. Critical assessment
- Strongest capability, Weakest capability (dropdown + short justification)
- Best suited for (multi-select), Worst suited for (textarea)
- Unique differentiator, Recommendation (textarea/dropdown)
- AI verification: claims total, correct, incorrect, unverifiable (numbers), Most notable AI error (textarea)

### 10. Evidence & submit
- Source types used (multi-select), Official doc URLs, Third-party URLs (textarea, one per line), Hands-on notes (textarea), Total hours (number)
- Then: Sign in with GitHub and **Submit**.

---

## 6. Best practices for using Gen AI output

- **Never submit AI output as-is.** Always verify against official docs or hands-on use.
- **Prefer official documentation.** Help centres, API docs, and release notes are more reliable than marketing pages.
- **Note the date.** Platforms change; note “as of [date]” in your version or notes if relevant.
- **If the AI says “Not available” or “Unknown,”** still try to find the answer yourself before leaving it as Unknown.
- **Correct the AI’s mistakes.** If you find the AI was wrong, fix the answer and, in sections that have it, set the “AI hallucination check” to reflect the error level (e.g. “AI made significant errors”).

---

## 7. Prompt for generative AI

**Instructions:** Copy only the prompt block below (the code block) into your generative AI tool. Do not paste the full protocol document. Replace `[PLATFORM NAME]` with the exact name of the platform you are evaluating (e.g. “Ag Leader SMS Advanced” or “Climate FieldView”). The AI will produce a draft of answers. Use this draft only as a starting point; you must verify every answer and then enter the verified answers into the online form yourself, with the correct evidence tags and source URLs.

---

```
You are helping complete a structured evaluation form for a precision agriculture software platform, for a college course (AGT3510). The platform to evaluate is: [PLATFORM NAME].

Your task: For each question below, provide an answer that matches the allowed options or format. Use only the option text exactly as written when the question lists options. If you cannot determine the answer from public information, use "Unknown" or "Not available" as appropriate. After each answer, add a brief note in parentheses about the source (e.g. "vendor documentation", "help center", "marketing site") if known.

Rules:
- Use the exact option wording from the lists below (e.g. "Not supported", "Yes", "Partial").
- For multi-select questions, list all that apply, comma-separated.
- For ratings (1–5), give a number and optionally one sentence justification.
- For text/textarea, give a short answer; for "justification" fields keep to the stated character limit.
- When in doubt, use "Unknown" or "Not available" rather than guessing.
- If a section does not apply to this platform (e.g. livestock section for a crop-only platform), say "Not applicable" for that section and skip listing every question.

Output your response in the same order as the sections below. Use clear headings: "Platform identity", "1. Data ingestion", "2A. Spatial & temporal", etc.

---

PLATFORM IDENTITY
- Version / module evaluated: (text – e.g. "Operations Center free tier, Feb 2026")
- Company / developer: (text)
- Country of origin: (one of: United States, Canada, Netherlands, Australia, New Zealand, Israel, Germany, Brazil, Switzerland, United Kingdom, Ukraine, Other)
- Year founded / launched: (text)
- Platform type: (select all that apply: Web-based (browser), Desktop installed (Windows), Desktop installed (Mac), Mobile app — iOS, Mobile app — Android, Hybrid (web + mobile), API-only (no GUI), Plugin/extension for other software)
- Primary agricultural focus: (select all that apply: Broadacre crops, Row crops, Specialty crops, Livestock — Beef/Dairy/Sheep/Goat/Swine/Poultry, Greenhouse / CEA, Mixed / Whole-farm, Sector-agnostic)
- Website URL: (url)
- Last updated / version: (text)

1. DATA INGESTION
- Open/standard geospatial formats: (multi-select from: Shapefile, GeoJSON, GeoTIFF, KML/KMZ, GeoPackage, CSV with coordinates, ISOXML/ISOBUS, WKT; or "Not supported")
- Proprietary machine data formats: (multi-select from: John Deere GreenStar 3/4, .dat, CNH, AGCO, Ag Leader, Trimble, Precision Planting, Raven, CLAAS, Topcon, Müller Elektronik; or "Not supported")
- Yield monitor import: (multi-select: John Deere, Case IH, New Holland, AGCO, CLAAS, Ag Leader, Trimble, Precision Planting, Loup Electronics; Not supported; Unknown)
- Satellite imagery: (multi-select: Built-in Sentinel-2, Landsat, Planet, MODIS, Via file upload, Via API, Not supported; Unknown)
- Drone imagery: (multi-select: Orthomosaics, DSM, DEM, NDVI maps, Raw multispectral, RGB, Thermal, DJI formats; Not supported; Unknown)
- Weather data: (multi-select: Built-in feeds, Historical, Field station, Manual, API, Davis, DTN, ECCC; Not supported; Unknown)
- Direct telematics: (multi-select: John Deere, CNH, AGCO, CLAAS, Trimble, Raven, Topcon, Ag Leader, Mixed fleet; Not supported; Unknown)
- Ease of import: (1–5, 1=Very difficult, 5=Very easy)
- Unit system: (one of: Fully supports Imperial/Metric/Canadian mixed; Supports Imperial and Metric but user chooses one; Imperial only; Metric only; Unknown)
- Data format limitations: (short text)

2A. SPATIAL & TEMPORAL
- Spatial filtering: (multi-select from: Filter by field boundary, management zone, custom polygon, administrative boundary, buffer zone, spatial query; Not available; Unknown)
- Temporal filtering: (multi-select: date range, crop year, growth stage, operation type, machine pass, time-series slider; Not available; Unknown)
- Multi-layer overlay: (multi-select: Yield+soil, Yield+elevation, Satellite+yield, As-applied+prescription, Multi-year comparison, Custom stacking, Transparency, Split-screen, Swipe; Not available; Unknown)
- CRS handling: (one of: Automatic; Manual selection; Fixed CRS only; Not applicable; Unknown)

2B. YIELD & AGONOMIC
- Yield data cleaning: (multi-select from: Start/stop delay removal, Grain flow lag, Narrow swath correction, Speed anomaly, GPS filtering, Header height, Statistical outlier, Automated pipeline, User-configurable; Not available; Unknown)
- Combine calibration: (multi-select: Multi-combine normalization, Multi-day normalization, Scale ticket, Operator/machine ID, Visual striping; Not available; Unknown)
- Yield map generation: (Yes / No / Partial)
- Vegetation indices: (multi-select: NDVI, NDRE, MSAVI, SAVI, OSAVI, EVI, GNDVI, NDMI/NDWI, Custom; Not available; Unknown)
- Management zone delineation: (multi-select: K-means, Manual, Threshold-based, Multi-layer, AI/ML-based; Not available; Unknown)
- VRA prescription: (multi-select: Seeding rate, Fertilizer N/P/K/S, Lime, Crop protection, Zones, Grid sampling; Not available; Unknown)
- Prescription export: (multi-select: ISOXML, Shapefile, John Deere, CNH, AGCO, Ag Leader, Trimble, CSV, GeoJSON; Not available; Unknown)
- Interpolation: (multi-select: IDW, Kriging, Nearest Neighbor, Spline; Not available)
- On-farm trial analysis: (multi-select: A/B strip, Randomized plot, Statistical significance, Economic analysis; Not available; Unknown)
- Profit/loss map: (multi-select: Input cost entry, Revenue from yield×price, Net return by zone, Spatial profit map, ROI on VRA, Machine cost from telematics; Not available; Unknown)
- Crop scouting: (multi-select: Geo-referenced points, Photo capture, Pest/disease manual, Pest/disease AI, Weed mapping, Growth stage, Scouting reports; Not available; Unknown)

2C. LIVESTOCK (if platform has livestock focus)
- Individual animal records: (one of: Yes — individual ID; Partial — group/lot; No; Not applicable; Unknown)
- RFID/EID: (multi-select: ISO 11784/85, ISO 18000-6C, Gallagher, Allflex/Datamars, Tru-Test; Not supported; Unknown)
- Breeding/genetics, Health/treatment, Grazing, Weight/growth: (Yes/No/Partial/Not applicable/Unknown each)
- Traceability: (multi-select: Birth/acquisition, Movement, Health/withdrawal, Breeding/genetics, Weight/ADG, Grazing, CCIA, USDA APHIS; Not supported; Unknown)

2D. GREENHOUSE / CEA (if platform has CEA focus)
- Climate control: (multi-select: Temperature, Humidity, CO2, Light/PAR, VPD, Setpoint control, Alarms, Historical logging; Not supported; Unknown)
- Irrigation/fertigation, Crop growth stage, Labor/task, Production planning: (Yes/No/Partial/Not applicable/Unknown)

2E. FINANCIAL
- Income tracking, Expense tracking: (Yes/No/Partial/Unknown)
- Cost of production: (Yes — per acre/hectare; Yes — per head; Yes — per unit; No; Partial; Unknown)
- Profitability analysis: (Yes/No/Partial/Unknown)
- Cost granularity: (multi-select: Per farm, Per field, Per zone, Per crop, Per head, Per operation; Not available; Unknown)
- Accounting integration: (multi-select: QuickBooks, Xero, Sage, FreshBooks, AgExpert Accounting, CSV export, API; Not available; Unknown)

3. DATA EXPORT
- Export geospatial: (multi-select: Shapefile, GeoJSON, GeoTIFF, KML/KMZ, ISOXML, GeoPackage)
- Export tabular: (multi-select: CSV, Excel, PDF reports, JSON)
- Export proprietary/other: (multi-select: John Deere, CNH, AGCO, Ag Leader, Trimble, Raven, Raw download, API, Bulk export, Print-ready maps; Not available)
- Batch export: (one of: Batch entire farm; Field-by-field; Layer-by-layer; API only; No batch; Unknown)
- Time to first map: (one of: Instant; Under 5 min; 5–30 min; Overnight/background; Manual vendor; Unknown)
- Report generation: (multi-select: Field summary, Yield analysis, Profitability, Custom builder; Not available; Unknown)

4. INTEGRATION
- Direct integrations: (multi-select from: John Deere Ops Center, CNH AFS, Climate FieldView, Cropwise, Ag Leader, Trimble, AGCO Fuse, AgExpert, TELUS Ag, Farmers Edge, GeoPard, Agworld, Raven, Precision Planting, QuickBooks/Xero, Leaf API, ADAPT; None identified)
- API availability: (one of: Public API; Partner/developer API; Private API; No API; Unknown)
- ISOBUS compliance: (Full; Partial; Via ADAPT; Not compliant; Unknown)
- OEM compatibility: (multi-select: John Deere, Case IH, New Holland, AGCO, CLAAS, Trimble, Ag Leader, Raven, Brand-agnostic; N/A; Unknown)
- Data format interoperability: (1–5 rating, Poor to Excellent)
- Hardware dependency: (one of: Fully software-independent; Enhanced by proprietary hardware; Partially locked; Fully locked; N/A; Unknown)
- ADAPT support: (Yes — full; Partial; No; Unknown)

5. GOVERNANCE
- Data ownership: (one of: User owns all; User owns + platform license; Shared; Platform owns; Unclear; Unknown)
- Data portability: (Full export; Partial; By request only; No export; Unknown)
- Data deletion: (Self-service all; Self-service some; Request only; No deletion; Unclear; Unknown)
- Data sharing: (No sharing; Opt-in; Opt-out; Anonymized; Mandatory; Not disclosed; Unknown)
- Ag Data Transparent: (Yes certified; Previously certified; In process; Not certified; Unknown)
- Privacy policy URL: (url)
- Storage location: (multi-select: US, Canada, EU, Australia, Multiple regions, On-premises; Not disclosed; Unknown)
- Security measures: (multi-select: Encryption at rest, TLS, MFA, SOC 2, ISO 27001, RBAC, Audit log, GDPR, PIPEDA; Not disclosed; Unknown)

6. ACCESS
- Multi-user: (Yes — how many; No; Unknown)
- User roles: (multi-select: Administrator, Manager, Operator, Agronomist, View-only, Custom; No roles; Unknown)
- Sharing with advisors: (Yes/No/Partial/Unknown)
- Offline: (Full offline; Partial; View-only offline; None; Unknown)
- Mobile app: (iOS; Android; Mobile-responsive web; No mobile; Unknown)
- Storage quotas: (Unlimited; By plan tier; By acreage; By fields; By volume; By head count; Not disclosed; Unknown)

7. PRICING
- Pricing model: (multi-select: Free, Freemium, Per-acre/hectare, Per-head, Flat monthly/annual, Per-seat, One-time license, Hardware-bundled, Custom; Unknown)
- Free tier: (Yes/No/Partial/Unknown)
- Free tier limitations: (multi-select if applicable; or "No free tier")
- Trial period: (Yes — duration; No; Unknown)
- Educational pricing: (Free accounts; Discounted; Trial for institutions; Demo/sandbox; No program; Not disclosed; Unknown)
- Contract: (No contract; Month-to-month; Annual; Multi-year; Equipment required; Dealer required; Unknown)
- Standardized cost broadacre (2,000 ac): currency, annual $, notes
- Standardized cost livestock (500 head): currency, annual $, notes
- Cost to leave: (Free export; Data retained; Data deleted; Export fee; Data locked; Unknown)

8. USABILITY
- Onboarding: (1–5, Very difficult to Very easy)
- Documentation quality: (Excellent; Good; Limited; Poor; None; Unknown)
- Training resources: (multi-select: Video, Webinars, In-person, Guides, Interactive tutorials, Certification, Community; None; Unknown)
- Support channels: (multi-select: Phone, Email, Live chat, AI chatbot, Ticket, Forum, Dealer, Social; None; Unknown)
- Support languages: (multi-select: English, French, Spanish, Portuguese, German, Dutch, Ukrainian, Mandarin, Other; Unknown)
- Update frequency: (short text)

9. CRITICAL ASSESSMENT
- Strongest capability: (one of: Data ingestion, Yield cleaning, Satellite/veg indices, Zone delineation, VRA, Financial, Livestock, CEA, Integration, Visualization, On-farm trial, Ease of use, Pricing, Governance, Mixed fleet; Other)
- Strongest justification: (max 200 chars)
- Weakest capability: (same option list)
- Weakest justification: (max 200 chars)
- Best suited for: (multi-select: Small/medium/large farm, Corporate, Agronomists, Retailers, Livestock, Dairy, CEA, Mixed, Beginners, Advanced, Researchers, Students)
- Worst suited for: (short text)
- Unique differentiator: (short text)
- Recommendation: (Yes — strong; Conditionally; Neutral; No; Cannot assess)
- AI verification counts: total claims, correct, incorrect, unverifiable (numbers)
- Most notable AI error: (short text if any)

10. EVIDENCE
- Source types used: (multi-select: Official docs, Trial/demo, Vendor site, YouTube, Academic, Extension, Blog/review, Reddit/forum, Dealer conversation, AI-generated, Peer evaluator)
- Official doc URLs: (one per line)
- Third-party URLs: (one per line)
- Hands-on notes: (text)
- Total hours spent: (number)

For every answer, add in parentheses the source type (e.g. "vendor documentation", "help center", "unknown"). Use "Unknown" or "Not available" whenever you cannot find a reliable public source.
```

---

**End of prompt.** After you receive the AI’s draft, follow the protocol in Section 2: verify each answer, test where possible, then enter the verified answers into the online form with the correct evidence tags and source URLs.
