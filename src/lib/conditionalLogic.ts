/**
 * Conditional visibility for form sections.
 * When a section is hidden, its fields are treated as N/A (excluded from scoring).
 */

const LIVESTOCK_FOCUS = [
  'Livestock — Beef',
  'Livestock — Dairy',
  'Livestock — Sheep/Goat',
  'Livestock — Swine',
  'Livestock — Poultry',
  'Mixed / Whole-farm',
]

const CEA_FOCUS = [
  'Greenhouse / Controlled Environment Agriculture (CEA)',
  'Mixed / Whole-farm',
]

export function showLivestockSection(primaryFocus: string[] | undefined): boolean {
  if (!Array.isArray(primaryFocus)) return false
  return LIVESTOCK_FOCUS.some((f) => primaryFocus.includes(f))
}

export function showCEASection(primaryFocus: string[] | undefined): boolean {
  if (!Array.isArray(primaryFocus)) return false
  return CEA_FOCUS.some((f) => primaryFocus.includes(f))
}
