/**
 * Form field definitions per section — options from AGT3510_Form_Options.md
 * FieldConfig is defined here to avoid circular dependency with FieldWithEvidence.
 */
export type FieldType = 'text' | 'textarea' | 'single_select' | 'multi_select' | 'rating' | 'number' | 'url'
export interface FieldConfig {
  key: string
  label: string
  type: FieldType
  options?: string[]
  placeholder?: string
  maxLength?: number
  ratingLabels?: [string, string]
  /** If true, show "Add custom option" with "Is this really necessary?" confirmation */
  allowCustomOptions?: boolean
}

export const AI_CHECK_OPTIONS = [
  'AI was 100% correct for this section',
  'AI made minor errors (1-2 fields wrong)',
  'AI made significant errors (3+ fields wrong or hallucinated capabilities)',
  'AI completely hallucinated capabilities that don\'t exist',
  'AI refused to answer / could not assess',
  'AI was not used for this section',
] as const

const COUNTRY_OPTIONS = ['United States', 'Canada', 'Netherlands', 'Australia', 'New Zealand', 'Israel', 'Germany', 'Brazil', 'Switzerland', 'United Kingdom', 'Ukraine', 'Other (specify)']

const PLATFORM_TYPE_OPTIONS = ['Web-based (browser)', 'Desktop installed (Windows)', 'Desktop installed (Mac)', 'Desktop installed (Linux)', 'Mobile app — iOS', 'Mobile app — Android', 'Hybrid (web + mobile)', 'API-only (no GUI)', 'Plugin/extension for other software']

const PRIMARY_FOCUS_OPTIONS = ['Broadacre crops (grains, oilseeds, pulses)', 'Row crops (corn, soybeans, cotton)', 'Specialty crops (vegetables, fruit, horticulture)', 'Livestock — Beef', 'Livestock — Dairy', 'Livestock — Sheep/Goat', 'Livestock — Swine', 'Livestock — Poultry', 'Greenhouse / Controlled Environment Agriculture (CEA)', 'Mixed / Whole-farm', 'Sector-agnostic (any agriculture)']

// Section 1: Ingestion
const FILE_IMPORT_OPEN = ['Shapefile (.shp/.shx/.dbf/.prj)', 'GeoJSON (.geojson)', 'GeoTIFF (.tif/.tiff)', 'KML / KMZ (.kml/.kmz)', 'GeoPackage (.gpkg)', 'ESRI File Geodatabase (.gdb)', 'ESRI formats (e.g. ArcGIS)', 'CAD (DWG/DXF)', 'CSV with coordinates (.csv)', 'ISOXML / ISOBUS (ISO 11783)', 'WKT (Well-Known Text)']
const FILE_IMPORT_PROPRIETARY = ['John Deere GreenStar 3 (.rcd files)', 'John Deere GreenStar 4 / Gen4 (.jdl files)', 'John Deere .dat files', 'CNH / Case IH / New Holland (.cn1, .xml)', 'AGCO / FieldStar (.agf, .fdd)', 'Ag Leader (.agdata, .yld)', 'Trimble / AgGPS (.agd, AgData, AgGPS folders)', 'Precision Planting 20|20 (.2020 files)', 'Raven (Slingshot formats)', 'CLAAS (Telematics formats)', 'Topcon / Sokkia', 'Müller Elektronik', 'Not supported']
const YIELD_MONITOR_IMPORT = ['John Deere (S-Series, X-Series, T-Series)', 'Case IH (Axial-Flow series)', 'New Holland (CR, CX series)', 'AGCO / Massey Ferguson / Fendt / Gleaner', 'CLAAS (Lexion, Tucano)', 'Ag Leader (aftermarket, brand-agnostic)', 'Trimble (aftermarket)', 'Precision Planting (aftermarket)', 'Loup Electronics (aftermarket)', 'Not supported', 'Unknown']
const SATELLITE_IMAGERY = ['Built-in — Sentinel-2 (ESA, 10m, 5-day revisit)', 'Built-in — Landsat 8/9 (NASA/USGS, 30m, 16-day revisit)', 'Built-in — Planet (3-5m, daily)', 'Built-in — MODIS (250m-1km, daily)', 'Built-in — Other commercial (specify)', 'Via file upload (user provides imagery)', 'Via API connection to third-party', 'Not supported', 'Unknown']
const DRONE_IMAGERY = ['Orthomosaics (GeoTIFF)', 'Digital Surface Models (DSM)', 'Digital Elevation Models (DEM)', 'LIDAR / point clouds', 'NDVI / index maps (pre-processed)', 'Raw multispectral images', 'RGB imagery', 'Thermal imagery', 'DJI native formats', 'Not supported', 'Unknown']
const WEATHER_DATA = ['Built-in — automated weather feeds (specify source)', 'Built-in — historical weather data', 'Connected field weather station (specify brands)', 'Manual entry', 'Via API (specify)', 'Davis Instruments stations', 'DTN weather integration', 'Environment and Climate Change Canada (ECCC)', 'Not supported', 'Unknown']
const TELEMATICS = ['John Deere (JDLink / MTG)', 'CNH Industrial (AFS Connect)', 'AGCO (Fuse Connected Services)', 'CLAAS (Telematics)', 'Trimble (Connected Farm)', 'Raven (Slingshot)', 'Topcon', 'Ag Leader', 'Mixed fleet / brand-agnostic telematics', 'Not supported', 'Unknown']
const UNIT_SYSTEM = ['Fully supports Imperial, Metric, and Canadian mixed units seamlessly', 'Supports Imperial and Metric but user must choose one system globally', 'Imperial only (US-centric)', 'Metric only', 'Unknown']

// Section 2A
const SPATIAL_FILTERING = ['Filter by field boundary', 'Filter by management zone', 'Filter by custom polygon (draw-on-map)', 'Filter by administrative boundary (county/municipality)', 'Filter by buffer zone (around a feature)', 'Spatial query (select features within / intersecting)', 'Not available', 'Unknown']
const TEMPORAL_FILTERING = ['Filter by date range', 'Filter by crop year / season', 'Filter by growth stage (phenological)', 'Filter by operation type (planting, spraying, harvest)', 'Filter by specific machine pass', 'Time-series slider / animation', 'Not available', 'Unknown']
const MULTI_LAYER = ['Yield + soil data overlay', 'Yield + elevation overlay', 'Satellite imagery + yield overlay', 'As-applied + prescription comparison', 'Multi-year yield comparison (side-by-side or stacked)', 'Custom layer stacking (user selects layers)', 'Transparency / opacity adjustment per layer', 'Split-screen comparison', 'Swipe comparison tool', 'Not available', 'Unknown']
const CRS_HANDLING = ['Automatic (detects and transforms CRS)', 'Manual selection required (user specifies CRS)', 'Fixed CRS only (e.g., WGS84 only)', 'Not applicable', 'Unknown']

// Section 2B
const YIELD_CLEANING = ['Start/stop pass delay removal (ramp-up/ramp-down)', 'Grain flow lag / time delay correction', 'Narrow swath / partial header width correction', 'Speed anomaly filtering (sudden speed changes)', 'GPS/GNSS signal quality filtering (HDOP, fix type)', 'Header height status filtering (up/down)', 'Statistical outlier removal', 'Automated cleaning pipeline (one-click)', 'User-configurable cleaning parameters', 'Not available', 'Unknown']
const COMBINE_CALIBRATION = ['Multi-combine normalization / pathwise calibration', 'Multi-day harvest normalization', 'Scale ticket reconciliation (adjust to known weights)', 'Operator / machine ID-based calibration', 'Visual striping / banding correction', 'Not available', 'Unknown']
const VEG_INDICES = ['NDVI (Normalized Difference Vegetation Index)', 'NDRE (Normalized Difference Red Edge)', 'MSAVI / MSAVI2', 'SAVI', 'OSAVI', 'EVI', 'GNDVI', 'NDMI / NDWI', 'Custom / user-defined indices', 'Not available', 'Unknown']
const ZONE_DELINEATION = ['K-means clustering', 'Manual zone drawing', 'Threshold-based (user-defined breakpoints)', 'Multi-layer input (yield + soil + elevation)', 'AI/ML-based zone delineation', 'Not available', 'Unknown']
const VRA_PRESCRIPTION = ['Seeding / planting rate prescriptions', 'Fertilizer rate prescriptions (N, P, K, S, micronutrients)', 'Lime application prescriptions', 'Crop protection product prescriptions', 'Based on management zones', 'Based on grid sampling', 'Custom / user-defined (e.g. manual editing as in QGIS)', 'Not available', 'Unknown']
const PRESCRIPTION_EXPORT = ['ISOXML / ISOBUS (ISO 11783)', 'Shapefile (.shp)', 'John Deere format (GS3 / Gen4 compatible)', 'CNH / Case IH / New Holland format', 'AGCO format', 'Ag Leader format', 'Trimble format (AgGPS / AgData)', 'CSV', 'GeoJSON', 'Not available', 'Unknown']
const INTERPOLATION = ['Inverse Distance Weighting (IDW)', 'Ordinary Kriging', 'Nearest Neighbor', 'Spline / Thin Plate Spline', 'Not available']
const CROP_SCOUTING = ['Geo-referenced observation points', 'Photo capture and attachment', 'Pest / disease identification (manual)', 'Pest / disease identification (AI-assisted)', 'Weed mapping', 'Growth stage recording', 'Scouting report generation', 'Not available', 'Unknown']
const PROFIT_LOSS = ['Input cost entry (per-acre / per-hectare)', 'Revenue calculation from yield × price', 'Net return by zone / grid cell', 'Spatial profit/loss mapping', 'Automated ROI on VRA', 'Machine cost allocation from telematics', 'Not available', 'Unknown']

// Section 2C Livestock
const INDIVIDUAL_ANIMAL = ['Yes — individual animal tracking with unique ID', 'Partial — group/lot-level tracking only', 'No', 'Not applicable (not a livestock platform)', 'Unknown']
const RFID_OPTIONS = ['ISO 11784/11785 (FDX-B, HDX)', 'ISO 18000-6C (UHF RFID)', 'Gallagher readers', 'Allflex / Datamars readers', 'Tru-Test readers', 'Not supported', 'Unknown']
const TRACEABILITY = ['Birth / acquisition records', 'Movement / transfer tracking', 'Health & treatment records with withdrawal periods', 'Breeding / genetics / pedigree', 'Weight / growth tracking (ADG, feed conversion)', 'Grazing / paddock management', 'CCIA (Canadian Cattle Identification Agency) integration', 'USDA APHIS integration', 'Not supported', 'Unknown']

// Section 2D CEA
const CLIMATE_CONTROL = ['Temperature monitoring', 'Relative humidity monitoring', 'CO2 concentration monitoring', 'Light intensity / PAR monitoring', 'VPD (Vapor Pressure Deficit) calculation', 'Climate setpoint control', 'Alarm / alert thresholds', 'Historical climate logging', 'Not supported', 'Unknown']

// Section 2E Financial
const COST_GRANULARITY = ['Per farm / whole operation', 'Per field / paddock', 'Per management zone', 'Per crop / enterprise', 'Per head (livestock)', 'Per operation / activity type', 'Not available', 'Unknown']
const ACCOUNTING_INTEGRATION = ['QuickBooks (Online or Desktop)', 'Xero', 'Sage', 'FreshBooks', 'AgExpert Accounting (FCC)', 'CSV export for manual import', 'API for custom accounting integration', 'Not available', 'Unknown']

// Section 3 Export
const EXPORT_GEOSPATIAL = ['Shapefile (.shp)', 'GeoJSON (.geojson)', 'GeoTIFF (.tif)', 'KML / KMZ (.kml/.kmz)', 'ISOXML / ISOBUS (ISO 11783)', 'GeoPackage (.gpkg)', 'ESRI File Geodatabase (.gdb)', 'ESRI formats (e.g. for ArcGIS)', 'CAD (DWG/DXF)']
const EXPORT_TABULAR = ['CSV (.csv)', 'Excel (.xlsx)', 'PDF reports (.pdf)', 'JSON']
const EXPORT_PROPRIETARY = ['John Deere (GS3 / Gen4 compatible)', 'CNH / Case IH / New Holland format', 'AGCO format', 'Ag Leader format', 'Trimble format (AgGPS / AgData)', 'Raven format', 'Raw data download (complete, original format)', 'API for programmatic data export', 'Bulk export (all fields / all data at once)', 'Print-ready maps (high resolution)', 'Not available']
const BATCH_EXPORT = ['Can batch-export entire farm (all fields, all layers, all years) in one operation', 'Must export field-by-field (one field at a time)', 'Must export layer-by-layer within each field', 'Export via API only (requires programming)', 'No batch export capability', 'Unknown']
const TIME_TO_MAP = ['Instant — map renders immediately upon data upload', 'Under 5 minutes — brief processing, then results', '5–30 minutes — moderate processing time', 'Requires overnight or background processing (hours)', 'Requires manual vendor intervention or support ticket', 'Unknown']

// Section 4 Integration
const DIRECT_INTEGRATIONS = ['John Deere Operations Center', 'CNH AFS Connect / PLM Connect', 'Climate FieldView (Bayer)', 'Cropwise (Syngenta)', 'Ag Leader SMS / InCommand', 'Trimble Ag Software / FarmENGAGE', 'AGCO Fuse', 'AgExpert (FCC)', 'TELUS Agriculture', 'Farmers Edge', 'GeoPard Agriculture', 'Agworld', 'Raven Slingshot', 'Precision Planting 20|20', 'QuickBooks / Xero (accounting)', 'Leaf API (data connector)', 'AgGateway ADAPT framework', 'None identified']
const API_AVAILABILITY = ['Public API — documented, open to third parties', 'Partner / developer API — documented, requires agreement', 'Private / internal API — exists but not publicly accessible', 'No API available', 'Unknown']
const ISOBUS_COMPLIANCE = ['Full compliance (import and export)', 'Partial compliance (import only OR export only)', 'Via ADAPT conversion framework', 'Not compliant', 'Unknown']
const OEM_EQUIPMENT = ['John Deere', 'Case IH', 'New Holland', 'AGCO (Massey Ferguson, Fendt, Valtra, Challenger)', 'CLAAS', 'Trimble (aftermarket)', 'Ag Leader (aftermarket)', 'Raven (aftermarket)', 'Brand-agnostic (any ISOBUS-compliant equipment)', 'Not applicable', 'Unknown']
const HARDWARE_DEPENDENCY = ['Fully software-independent — all core features work without proprietary hardware', 'Enhanced by proprietary hardware — manual uploads work, but automated data sync / telematics require specific hardware', 'Partially locked to proprietary hardware — key features require specific hardware', 'Fully locked to proprietary hardware — cannot meaningfully use the platform without the vendor\'s hardware ecosystem', 'Not applicable (cloud-only platform with no hardware dimension)', 'Unknown']
const ADAPT_SUPPORT = ['Yes — full ADAPT support (imports and exports via ADAPT plugins)', 'Partial — uses ADAPT for some format conversions', 'No — does not support ADAPT', 'Unknown']

// Section 5 Governance
const DATA_OWNERSHIP = ['User owns all data (clearly stated in terms)', 'User owns data, platform has license to use for service delivery', 'Shared ownership (platform claims co-ownership)', 'Platform owns data after upload', 'Unclear / not stated in terms', 'Unknown']
const DATA_PORTABILITY = ['Full export — all raw and processed data downloadable in standard formats', 'Partial export — some data exportable, some locked or in proprietary format only', 'Export by request only (must contact support)', 'No export capability identified', 'Unknown']
const DATA_DELETION = ['User can delete all data at any time (self-service)', 'User can delete some data (self-service), full deletion by request', 'Deletion by request only (contact support)', 'No deletion capability identified', 'Unclear / not stated', 'Unknown']
const DATA_SHARING = ['No sharing — data is never shared with third parties', 'Opt-in only — user must actively consent to sharing', 'Opt-out — sharing is default, user can disable', 'Anonymized / aggregated sharing (no individual identification)', 'Mandatory sharing (required for service)', 'Not disclosed', 'Unknown']
const ADT_CERT = ['Yes — currently certified (provide certification year)', 'Previously certified (certification expired or withdrawn)', 'In process / pending', 'Not certified', 'Unknown']
const STORAGE_LOCATION = ['United States (AWS / Azure / GCP — specify if known)', 'Canada', 'European Union', 'Australia', 'Multiple regions (geo-replicated)', 'On-premises / local (no cloud)', 'Not disclosed', 'Unknown']
const SECURITY_MEASURES = ['Encryption at rest (AES-256 or equivalent)', 'Encryption in transit (TLS/SSL)', 'Multi-factor authentication (MFA)', 'SOC 2 Type II certified', 'ISO 27001 certified', 'Role-based access control (RBAC)', 'Audit logging', 'GDPR compliant', 'PIPEDA compliant (Canada)', 'Not disclosed', 'Unknown']

// Section 6 Access
const USER_ROLES = ['Administrator / Owner', 'Manager', 'Operator / Field worker', 'Agronomist / Advisor (external)', 'View-only / Read-only', 'Custom roles (user-defined)', 'No roles — single user level', 'Unknown']
const OFFLINE_FUNCTIONALITY = ['Full offline — all features available without internet', 'Partial offline — some features work offline, sync when connected', 'View-only offline — can view cached data but cannot process', 'None — requires internet connection for all functions', 'Unknown']
const MOBILE_APP = ['iOS (iPhone/iPad)', 'Android (phone/tablet)', 'Mobile-responsive web (no dedicated app)', 'No mobile support', 'Unknown']
const STORAGE_QUOTAS = ['Unlimited (no stated limits)', 'Limited by plan tier (specify limits if known)', 'Limited by acreage / hectarage', 'Limited by number of fields', 'Limited by data volume (GB)', 'Limited by number of animals / head count', 'Not disclosed', 'Unknown']

// Section 7 Pricing
const PRICING_MODEL = ['Free (no cost, full access)', 'Freemium (free tier with paid upgrades)', 'Per-acre / per-hectare pricing', 'Per-head pricing (livestock)', 'Flat subscription (monthly)', 'Flat subscription (annual)', 'Per-seat / per-user pricing', 'One-time perpetual license', 'Hardware-bundled (included with equipment purchase)', 'Custom / enterprise pricing (contact sales)', 'Unknown']
const FREE_TIER_LIMITATIONS = ['Limited number of fields', 'Limited acreage', 'Limited features (specify which are locked)', 'Limited data storage', 'Limited export capabilities', 'Limited historical data access', 'Watermarked outputs', 'No limitations (fully free)', 'No free tier available', 'Unknown']
const EDUCATIONAL_ACCESS = ['Free educational accounts available', 'Discounted educational pricing', 'Trial accounts for educational institutions', 'Demo / sandbox environment available', 'No educational program', 'Not disclosed', 'Unknown']
const CONTRACT_REQUIREMENTS = ['No contract — cancel anytime', 'Month-to-month', 'Annual contract', 'Multi-year contract (2+ years)', 'Equipment purchase requirement', 'Dealer relationship required', 'Unknown']
const COST_TO_LEAVE = ['Free — full data export, no penalty', 'Data retained for limited period after cancellation (specify)', 'Data deleted upon cancellation', 'Export fee or penalty', 'Data locked / inaccessible after cancellation', 'Unknown']
const CURRENCY_OPTIONS = ['CAD', 'USD', 'EUR', 'AUD', 'NZD']
const PRICING_METRIC_BROADACRE = ['Per Acre', 'Per Hectare', 'Flat Annual', 'Per Seat', 'Custom calculation']
const PRICING_METRIC_LIVESTOCK = ['Per Head', 'Flat Annual', 'Per Seat', 'Custom calculation']

// Section 8 Usability
const DOCUMENTATION_QUALITY = ['Excellent — comprehensive knowledge base, searchable, regularly updated', 'Good — adequate documentation, covers main features', 'Limited — basic FAQ or sparse documentation', 'Poor — minimal or outdated documentation', 'None found', 'Unknown']
const TRAINING_RESOURCES = ['Video tutorials (YouTube, embedded)', 'Webinars (live or recorded)', 'In-person training (dealer or company-hosted)', 'Written guides / knowledge base', 'Interactive tutorials / walkthroughs (in-app)', 'Certification programs', 'Community forum / user group', 'Documentation only (no other training)', 'None found', 'Unknown']
const SUPPORT_CHANNELS = ['Phone support', 'Email support', 'Live chat (in-app or website)', 'AI chatbot', 'Support ticket system', 'Community forum', 'Dealer network (local support)', 'Social media support', 'None identified', 'Unknown']
const SUPPORT_LANGUAGES = ['English', 'French', 'Spanish', 'Portuguese', 'German', 'Dutch', 'Ukrainian', 'Mandarin / Chinese', 'Other (specify)', 'Unknown']

// Section 9 Assessment
const STRONGEST_WEAKEST_OPTIONS = ['Data ingestion / format compatibility', 'Yield data cleaning and processing', 'Satellite imagery and vegetation index analysis', 'Management zone delineation', 'VRA prescription creation and export', 'Financial analysis / profitability mapping', 'Livestock management', 'Greenhouse / CEA management', 'Integration / interoperability with other systems', 'Data visualization and mapping', 'On-farm trial analysis', 'Ease of use / user experience', 'Pricing / accessibility', 'Data governance and transparency', 'Mixed fleet / brand-agnostic support', 'Other (specify)']
const BEST_SUITED_FOR = ['Small farms (< 500 acres / < 200 ha)', 'Medium farms (500–5,000 acres / 200–2,000 ha)', 'Large farms (> 5,000 acres / > 2,000 ha)', 'Corporate / multi-farm operations', 'Agronomists / crop advisors / consultants', 'Agricultural retailers / input suppliers', 'Livestock producers (cow-calf, feedlot)', 'Dairy operations', 'Greenhouse / CEA operators', 'Mixed farming operations', 'Precision ag beginners', 'Advanced precision ag users', 'Researchers / academic users', 'Students / educational use']
const RECOMMENDATION_OPTIONS = ['Yes — strong recommendation for the right operation', 'Conditionally — good for specific use cases (explain in notes)', 'Neutral — acceptable but not outstanding', 'No — significant gaps or concerns', 'Cannot assess — insufficient access to evaluate']

// Section 10 Evidence — exported for SectionEvidence UI
export const SOURCE_TYPES_USED = ['Official platform documentation / help center', 'Platform trial or demo account (hands-on)', 'Vendor website / marketing materials', 'YouTube tutorials or demo videos', 'Academic papers / peer-reviewed research', 'Extension service publications (university)', 'Independent blog or review (e.g., PrecisionAg, AgFunder)', 'Reddit / forum discussions', 'Dealer or sales representative conversation', 'AI-generated (specify tool used)', 'Peer evaluator (from class)']

/** Section keys that show "Possible using plugins or extensions" checkbox */
export const SECTIONS_WITH_PLUGINS_CHECKBOX = ['ingestion', 'export', 'integration', 'processing_2a', 'processing_2b'] as const

function fc(key: string, label: string, type: FieldConfig['type'], options?: string[], extra?: Partial<FieldConfig>): FieldConfig {
  return { key, label, type, options, ...extra }
}

export const SECTION_FIELDS: Record<string, FieldConfig[]> = {
  identity: [
    fc('version_module_evaluated', 'Version / module evaluated', 'text', undefined, { placeholder: 'e.g. Operations Center — free tier, Feb 2026' }),
    fc('company_developer', 'Company / developer', 'text'),
    fc('country_of_origin', 'Country of origin', 'single_select', COUNTRY_OPTIONS),
    fc('year_founded', 'Year founded / launched', 'text', undefined, { placeholder: 'e.g. 1992' }),
    fc('platform_type', 'Platform type', 'multi_select', PLATFORM_TYPE_OPTIONS, { allowCustomOptions: true }),
    fc('primary_agricultural_focus', 'Primary agricultural focus', 'multi_select', PRIMARY_FOCUS_OPTIONS, { allowCustomOptions: true }),
    fc('website_url', 'Website URL', 'url'),
    fc('last_updated_version', 'Last updated / version', 'text', undefined, { placeholder: 'e.g. v22.10 — Feb 2026' }),
  ],
  ingestion: [
    fc('file_format_import_open', 'Open / standard geospatial formats (import)', 'multi_select', FILE_IMPORT_OPEN, { allowCustomOptions: true }),
    fc('file_format_import_proprietary', 'Proprietary machine data formats (import)', 'multi_select', FILE_IMPORT_PROPRIETARY, { allowCustomOptions: true }),
    fc('yield_monitor_import', 'Yield monitor data import — supported brands', 'multi_select', YIELD_MONITOR_IMPORT, { allowCustomOptions: true }),
    fc('satellite_imagery', 'Satellite imagery integration', 'multi_select', SATELLITE_IMAGERY, { allowCustomOptions: true }),
    fc('drone_imagery', 'Drone / UAV imagery import', 'multi_select', DRONE_IMAGERY, { allowCustomOptions: true }),
    fc('weather_data', 'Weather data integration', 'multi_select', WEATHER_DATA, { allowCustomOptions: true }),
    fc('direct_telematics', 'Direct machine / telematics connection', 'multi_select', TELEMATICS, { allowCustomOptions: true }),
    fc('ease_of_import', 'Ease of import (subjective)', 'rating', undefined, { ratingLabels: ['Very difficult', 'Very easy'] }),
    fc('ease_of_import_reason', 'Reason for ease of import rating (optional — because it is subjective)', 'textarea', undefined, { placeholder: 'Briefly explain why you gave this rating', maxLength: 400 }),
    fc('unit_system_handling', 'Unit system handling', 'single_select', UNIT_SYSTEM),
    fc('data_format_limitations', 'Data format limitations or issues noted', 'textarea', undefined, { maxLength: 500 }),
  ],
  processing_2a: [
    fc('spatial_filtering', 'Spatial filtering capabilities', 'multi_select', SPATIAL_FILTERING),
    fc('temporal_filtering', 'Temporal filtering capabilities', 'multi_select', TEMPORAL_FILTERING),
    fc('multi_layer_overlay', 'Multi-layer overlay capabilities', 'multi_select', MULTI_LAYER),
    fc('coordinate_system_handling', 'Coordinate reference system handling', 'single_select', CRS_HANDLING),
  ],
  processing_2b: [
    fc('yield_data_cleaning', 'Yield data cleaning capabilities', 'multi_select', YIELD_CLEANING),
    fc('combine_calibration_adjustment', 'Combine calibration adjustment', 'multi_select', COMBINE_CALIBRATION),
    fc('yield_map_generation', 'Yield map generation', 'single_select', ['Yes', 'No', 'Partial']),
    fc('yield_map_generation_notes', 'Yield map generation — notes or justification (e.g. why Partial)', 'textarea', undefined, { placeholder: 'Optional: justify Partial or add details', maxLength: 300 }),
    fc('vegetation_index_calculation', 'Vegetation index calculation', 'multi_select', VEG_INDICES, { allowCustomOptions: true }),
    fc('management_zone_delineation', 'Management zone delineation', 'multi_select', ZONE_DELINEATION, { allowCustomOptions: true }),
    fc('vra_prescription_map_creation', 'VRA prescription map creation', 'multi_select', VRA_PRESCRIPTION, { allowCustomOptions: true }),
    fc('prescription_export_formats', 'Prescription export formats', 'multi_select', PRESCRIPTION_EXPORT, { allowCustomOptions: true }),
    fc('interpolation_methods', 'Interpolation methods available', 'multi_select', INTERPOLATION),
    fc('on_farm_trial_analysis', 'On-farm trial / strip trial analysis', 'multi_select', ['A/B strip comparison', 'Randomized plot comparison', 'Statistical significance testing', 'Economic analysis of trial results', 'Not available', 'Unknown']),
    fc('profit_loss_map', 'Profit / loss map generation & agronomic-financial link', 'multi_select', PROFIT_LOSS),
    fc('crop_scouting_tools', 'Crop scouting tools', 'multi_select', CROP_SCOUTING),
  ],
  processing_2c_livestock: [
    fc('individual_animal_records', 'Individual animal records', 'single_select', INDIVIDUAL_ANIMAL),
    fc('rfid_eid_integration', 'RFID / EID integration', 'multi_select', RFID_OPTIONS),
    fc('breeding_genetics_tracking', 'Breeding & genetics tracking', 'single_select', ['Yes', 'No', 'Partial', 'Not applicable', 'Unknown']),
    fc('health_treatment_records', 'Health & treatment records', 'single_select', ['Yes', 'No', 'Partial', 'Not applicable', 'Unknown']),
    fc('grazing_management', 'Grazing management', 'single_select', ['Yes', 'No', 'Partial', 'Not applicable', 'Unknown']),
    fc('weight_growth_tracking', 'Weight / growth tracking', 'single_select', ['Yes', 'No', 'Partial', 'Not applicable', 'Unknown']),
    fc('traceability_birth_to_harvest', 'Traceability (birth to harvest)', 'multi_select', TRACEABILITY),
  ],
  processing_2d_cea: [
    fc('climate_control_monitoring', 'Climate control monitoring', 'multi_select', CLIMATE_CONTROL),
    fc('irrigation_fertigation', 'Irrigation / fertigation management', 'single_select', ['Yes', 'No', 'Partial', 'Not applicable', 'Unknown']),
    fc('crop_growth_stage_tracking', 'Crop growth stage tracking', 'single_select', ['Yes', 'No', 'Not applicable', 'Unknown']),
    fc('labor_task_management', 'Labor / task management', 'single_select', ['Yes', 'No', 'Partial', 'Not applicable', 'Unknown']),
    fc('production_planning', 'Production planning', 'single_select', ['Yes', 'No', 'Partial', 'Not applicable', 'Unknown']),
  ],
  processing_2e_financial: [
    fc('income_tracking', 'Income tracking', 'single_select', ['Yes', 'No', 'Partial', 'Unknown']),
    fc('expense_tracking', 'Expense tracking', 'single_select', ['Yes', 'No', 'Partial', 'Unknown']),
    fc('cost_of_production', 'Cost of production calculation', 'single_select', ['Yes — per acre/hectare', 'Yes — per head', 'Yes — per unit', 'No', 'Partial', 'Unknown']),
    fc('profitability_analysis', 'Profitability analysis by field/zone', 'single_select', ['Yes', 'No', 'Partial', 'Unknown']),
    fc('cost_tracking_granularity', 'Cost tracking granularity', 'multi_select', COST_GRANULARITY),
    fc('integration_accounting', 'Integration with accounting software', 'multi_select', ACCOUNTING_INTEGRATION),
  ],
  export: [
    fc('export_geospatial', 'Data export — geospatial formats', 'multi_select', EXPORT_GEOSPATIAL, { allowCustomOptions: true }),
    fc('export_tabular', 'Data export — tabular/report formats', 'multi_select', EXPORT_TABULAR, { allowCustomOptions: true }),
    fc('export_proprietary', 'Data export — proprietary / other', 'multi_select', EXPORT_PROPRIETARY, { allowCustomOptions: true }),
    fc('batch_export', 'Batch export capability', 'single_select', BATCH_EXPORT),
    fc('time_to_first_map', 'Time to first map (time to value)', 'single_select', TIME_TO_MAP),
    fc('report_generation', 'Report generation', 'multi_select', ['Field summary reports', 'Yield analysis reports', 'Profitability reports', 'Custom report builder', 'Not available', 'Unknown']),
  ],
  integration: [
    fc('direct_integrations', 'Direct platform integrations', 'multi_select', DIRECT_INTEGRATIONS, { allowCustomOptions: true }),
    fc('api_availability', 'API availability', 'single_select', API_AVAILABILITY),
    fc('isobus_compliance', 'ISOBUS / ISO 11783 compliance', 'single_select', ISOBUS_COMPLIANCE),
    fc('oem_equipment_compatibility', 'OEM equipment compatibility', 'multi_select', OEM_EQUIPMENT),
    fc('data_format_interoperability', 'Data format interoperability (subjective)', 'rating', undefined, { ratingLabels: ['Poor', 'Excellent'] }),
    fc('hardware_dependency', 'Hardware dependency', 'single_select', HARDWARE_DEPENDENCY),
    fc('adapt_support', 'AgGateway ADAPT framework support', 'single_select', ADAPT_SUPPORT),
  ],
  governance: [
    fc('data_ownership_policy', 'Data ownership policy', 'single_select', DATA_OWNERSHIP),
    fc('data_portability', 'Data portability', 'single_select', DATA_PORTABILITY),
    fc('data_deletion_policy', 'Data deletion policy', 'single_select', DATA_DELETION),
    fc('data_sharing_third_parties', 'Data sharing with third parties', 'single_select', DATA_SHARING),
    fc('ag_data_transparent', 'Ag Data Transparent certified', 'single_select', ADT_CERT),
    fc('privacy_policy_url', 'Privacy policy URL', 'url'),
    fc('data_storage_location', 'Data storage location', 'multi_select', STORAGE_LOCATION),
    fc('security_measures', 'Encryption / security measures described', 'multi_select', SECURITY_MEASURES),
  ],
  access: [
    fc('multi_user_access', 'Multi-user access', 'single_select', ['Yes — specify how many', 'No', 'Unknown']),
    fc('user_roles', 'User roles / permission levels', 'multi_select', USER_ROLES),
    fc('sharing_advisors', 'Sharing with advisors / agronomists', 'single_select', ['Yes', 'No', 'Partial', 'Unknown']),
    fc('offline_functionality', 'Offline functionality', 'single_select', OFFLINE_FUNCTIONALITY),
    fc('mobile_app_available', 'Mobile app available', 'multi_select', MOBILE_APP),
    fc('storage_quotas', 'Storage quotas or limits', 'single_select', STORAGE_QUOTAS),
  ],
  pricing: [
    fc('pricing_model', 'Pricing model', 'multi_select', PRICING_MODEL),
    fc('free_tier_available', 'Free tier available', 'single_select', ['Yes', 'No', 'Partial — describe', 'Unknown']),
    fc('free_tier_limitations', 'Free tier limitations (if applicable)', 'multi_select', FREE_TIER_LIMITATIONS),
    fc('trial_period', 'Trial period', 'single_select', ['Yes — duration', 'No', 'Unknown']),
    fc('educational_pricing', 'Educational / student pricing', 'single_select', EDUCATIONAL_ACCESS),
    fc('contract_requirements', 'Contract requirements', 'single_select', CONTRACT_REQUIREMENTS),
    fc('standardized_cost_broadacre_currency', 'Standardized cost — 2,000 ac grain farm: currency', 'single_select', CURRENCY_OPTIONS),
    fc('standardized_cost_broadacre_annual', 'Standardized cost — 2,000 ac grain farm: annual $', 'number'),
    fc('standardized_cost_broadacre_notes', 'Standardized cost broadacre: calculation notes', 'textarea', undefined, { maxLength: 200 }),
    fc('standardized_cost_livestock_currency', 'Standardized cost — 500 head cow-calf: currency', 'single_select', CURRENCY_OPTIONS),
    fc('standardized_cost_livestock_annual', 'Standardized cost — 500 head cow-calf: annual $', 'number'),
    fc('standardized_cost_livestock_notes', 'Standardized cost livestock: calculation notes', 'textarea', undefined, { maxLength: 200 }),
    fc('cost_to_leave', 'Cost to leave / data retention after cancellation', 'single_select', COST_TO_LEAVE),
  ],
  usability: [
    fc('onboarding_setup', 'Onboarding / setup experience', 'rating', undefined, { ratingLabels: ['Very difficult', 'Very easy'] }),
    fc('documentation_quality', 'Documentation quality', 'single_select', DOCUMENTATION_QUALITY),
    fc('training_resources', 'Training resources available', 'multi_select', TRAINING_RESOURCES),
    fc('customer_support_channels', 'Customer support channels', 'multi_select', SUPPORT_CHANNELS),
    fc('support_languages', 'Support language', 'multi_select', SUPPORT_LANGUAGES),
    fc('update_frequency', 'Update frequency', 'text', undefined, { placeholder: 'Describe how often updated' }),
  ],
  assessment: [
    fc('strongest_capability', 'Strongest capability', 'single_select', STRONGEST_WEAKEST_OPTIONS),
    fc('strongest_capability_justification', 'Strongest capability — justification (max 200 chars)', 'textarea', undefined, { maxLength: 200 }),
    fc('weakest_capability', 'Weakest capability or biggest gap', 'single_select', STRONGEST_WEAKEST_OPTIONS),
    fc('weakest_capability_justification', 'Weakest capability — justification (max 200 chars)', 'textarea', undefined, { maxLength: 200 }),
    fc('best_suited_for', 'Best suited for', 'multi_select', BEST_SUITED_FOR),
    fc('worst_suited_for', 'Worst suited for', 'textarea', undefined, { maxLength: 300 }),
    fc('unique_differentiator', 'Unique differentiator', 'textarea', undefined, { maxLength: 300 }),
    fc('recommendation', 'Would you recommend it?', 'single_select', RECOMMENDATION_OPTIONS),
    fc('ai_claims_total', 'AI verification: number of claims initially generated by AI', 'number'),
    fc('ai_claims_correct', 'AI verification: number of claims verified as CORRECT', 'number'),
    fc('ai_claims_incorrect', 'AI verification: number of claims verified as INCORRECT', 'number'),
    fc('ai_claims_unverifiable', 'AI verification: number of claims that could NOT be verified', 'number'),
    fc('ai_notable_error', 'Most notable AI error discovered (max 300 chars)', 'textarea', undefined, { maxLength: 300 }),
  ],
  evidence: [
    fc('source_types_used', 'Source types used', 'multi_select', SOURCE_TYPES_USED),
    fc('official_doc_urls', 'Official documentation URLs used', 'textarea', undefined, { placeholder: 'One per line', maxLength: 2000 }),
    fc('third_party_urls', 'Third-party review sources', 'textarea', undefined, { placeholder: 'One per line', maxLength: 2000 }),
    fc('hands_on_notes', 'Hands-on testing notes', 'textarea', undefined, { maxLength: 1000 }),
    fc('total_hours_spent', 'Total time spent on this evaluation (hours)', 'number'),
  ],
}

export function getFieldsForSection(sectionKey: string): FieldConfig[] {
  return SECTION_FIELDS[sectionKey] ?? []
}

export function getAiCheckOptions(): readonly string[] {
  return AI_CHECK_OPTIONS
}
