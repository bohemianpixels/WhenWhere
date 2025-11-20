import { TravelItem } from '../types';

export type ClimateType = 'summer' | 'winter' | 'mild' | 'none';

export type ClimateSummary = {
  hasSummer: boolean;
  hasWinter: boolean;
  hasMild: boolean;
};

export type MonthCountryClimateMap = Record<string, Record<string, ClimateSummary>>;

export type ClimateVariant =
  | 'summer'
  | 'winter'
  | 'mild'
  | 'summer-winter'
  | 'summer-mild'
  | 'winter-mild'
  | 'mixed'
  | null;

/**
 * Classify climate type from category_raw field
 */
export function classifyClimate(categoryRaw: string): ClimateType {
  const c = (categoryRaw || '').toLowerCase();

  // Winter-style: cold, snow, ski
  if (
    c.includes('ski') ||
    c.includes('snow') ||
    c.includes('northern lights') ||
    c.includes('aurora') ||
    c.includes('ice') ||
    c.includes('winter') ||
    c.includes('polar')
  ) {
    return 'winter';
  }

  // Summer-style: beach, warm, islands, coast, sea
  if (
    c.includes('beach') ||
    c.includes('warm') ||
    c.includes('islands') ||
    c.includes('coast') ||
    c.includes('sea') ||
    c.includes('surf') ||
    c.includes('water')
  ) {
    return 'summer';
  }

  // Mild / in-between: city, culture, trekking, hiking, mountains, safari, wildlife, festival
  if (
    c.includes('city') ||
    c.includes('urban') ||
    c.includes('culture') ||
    c.includes('trek') ||
    c.includes('hiking') ||
    c.includes('mountain') ||
    c.includes('safari') ||
    c.includes('wildlife') ||
    c.includes('festival')
  ) {
    return 'mild';
  }

  return 'none';
}

/**
 * Split country field to handle cases like "Chile / Argentina"
 */
function splitCountryField(value: string): string[] {
  return value
    .split(/[,/;&]|–|-/)
    .map((part) => part.replace(/\(.*?\)/g, ' ').trim())
    .filter(Boolean);
}

/**
 * Build month → country → climate summary map from travel items
 */
export function buildMonthCountryClimateMap(travelItems: TravelItem[]): MonthCountryClimateMap {
  const map: MonthCountryClimateMap = {};

  travelItems.forEach((item) => {
    const month = item.month;
    const climate = classifyClimate(item.category_raw);
    
    if (climate === 'none') return;

    const countryNames = splitCountryField(item.country);

    countryNames.forEach((countryName) => {
      if (!map[month]) {
        map[month] = {};
      }
      if (!map[month][countryName]) {
        map[month][countryName] = {
          hasSummer: false,
          hasWinter: false,
          hasMild: false,
        };
      }

      const summary = map[month][countryName];
      if (climate === 'summer') summary.hasSummer = true;
      if (climate === 'winter') summary.hasWinter = true;
      if (climate === 'mild') summary.hasMild = true;
    });
  });

  return map;
}

/**
 * Get climate variant for a specific month and country
 */
export function getClimateVariantForCountry(
  selectedMonth: string | null,
  countryName: string,
  monthCountryClimateMap: MonthCountryClimateMap
): ClimateVariant {
  if (!selectedMonth || !monthCountryClimateMap[selectedMonth]) {
    return null;
  }

  const summary = monthCountryClimateMap[selectedMonth][countryName];
  if (!summary) {
    return null;
  }

  const { hasSummer, hasWinter, hasMild } = summary;
  const count = [hasSummer, hasWinter, hasMild].filter(Boolean).length;

  if (count === 0) return null;

  if (count === 1) {
    if (hasSummer) return 'summer';
    if (hasWinter) return 'winter';
    if (hasMild) return 'mild';
  }

  if (count === 2) {
    if (hasSummer && hasWinter) return 'summer-winter';
    if (hasSummer && hasMild) return 'summer-mild';
    if (hasWinter && hasMild) return 'winter-mild';
  }

  if (count === 3) {
    return 'mixed';
  }

  return null;
}

