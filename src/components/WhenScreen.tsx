import { useEffect, useMemo, useState } from 'react';
import { MapContainer, GeoJSON, Marker } from 'react-leaflet';
import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import L from 'leaflet';
import { TravelItem } from '../types';
import { MonthCountryClimateMap, getClimateVariantForCountry, ClimateVariant } from '../utils/climate';
import 'leaflet/dist/leaflet.css';

const monthOptions = [
  { label: 'ינואר', value: 'January' },
  { label: 'פברואר', value: 'February' },
  { label: 'מרץ', value: 'March' },
  { label: 'אפריל', value: 'April' },
  { label: 'מאי', value: 'May' },
  { label: 'יוני', value: 'June' },
  { label: 'יולי', value: 'July' },
  { label: 'אוגוסט', value: 'August' },
  { label: 'ספטמבר', value: 'September' },
  { label: 'אוקטובר', value: 'October' },
  { label: 'נובמבר', value: 'November' },
  { label: 'דצמבר', value: 'December' },
];

const normalizeCountryKey = (value: string): string => {
  return value
    .normalize('NFD')
    .replace(/\(.*?\)/g, ' ')
    .replace(/[&+/]/g, ' ')
    .replace(/[^a-zA-Z\s]/g, ' ')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
};

const rawAliasMap: Record<string, string> = {
  usa: 'United States of America',
  'u s a': 'United States of America',
  'united states': 'United States of America',
  'united states of america': 'United States of America',
  uk: 'United Kingdom',
  'great britain': 'United Kingdom',
  britain: 'United Kingdom',
  'czech republic': 'Czechia',
  'south korea': 'Republic of Korea',
  'north korea': "Democratic People's Republic of Korea",
  tanzania: 'United Republic of Tanzania',
  iran: 'Iran (Islamic Republic of)',
  syria: 'Syrian Arab Republic',
  russia: 'Russian Federation',
  moldova: 'Republic of Moldova',
  bolivia: 'Bolivia (Plurinational State of)',
  venezuela: 'Venezuela (Bolivarian Republic of)',
  laos: "Lao People's Democratic Republic",
  'micronesia': 'Micronesia (Federated States of)',
  'congo': 'Democratic Republic of the Congo',
  'republic of congo': 'Republic of the Congo',
  'cape verde': 'Cabo Verde',
  'eswatini': 'Eswatini',
  swaziland: 'Eswatini',
  'uae': 'United Arab Emirates',
  'united arab emirates': 'United Arab Emirates',
  'myanmar': 'Myanmar',
  'burma': 'Myanmar',
  'ivory coast': "Côte d'Ivoire",
  'cote divoire': "Côte d'Ivoire",
  'north macedonia': 'North Macedonia',
  'bosnia': 'Bosnia and Herzegovina',
  'bahamas': 'Bahamas',
  'democratic republic of congo': 'Democratic Republic of the Congo',
};

const aliasMap = Object.entries(rawAliasMap).reduce<Record<string, string>>((acc, [from, to]) => {
  acc[normalizeCountryKey(from)] = normalizeCountryKey(to);
  return acc;
}, {});

const splitCountryField = (value: string): string[] => {
  return value
    .split(/[,/;&]|–|-/)
    .map((part) => part.replace(/\(.*?\)/g, ' ').trim())
    .filter(Boolean);
};

type CountriesGeoJSON = FeatureCollection<Geometry, GeoJsonProperties>;

interface WhenScreenProps {
  travelItems: TravelItem[];
  monthCountryClimateMap: MonthCountryClimateMap;
  onBack: () => void;
}

type CountryCenter = {
  displayName: string;
  center: [number, number];
};

export function WhenScreen({ travelItems, monthCountryClimateMap, onBack }: WhenScreenProps) {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [countriesData, setCountriesData] = useState<CountriesGeoJSON | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [geoLoading, setGeoLoading] = useState<boolean>(true);
  const [countryCenters, setCountryCenters] = useState<Map<string, CountryCenter>>(new Map());

  useEffect(() => {
    fetch('/data/countries.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load countries map');
        return res.json();
      })
      .then((json: CountriesGeoJSON) => {
        setCountriesData(json);
        const centersMap = new Map<string, CountryCenter>();
        json.features.forEach((feature) => {
          const name = String(feature.properties?.name ?? '');
          const normalized = normalizeCountryKey(name);
          if (!normalized) return;
          const center = calculateFeatureCenter(feature.geometry);
          if (!center) return;
          centersMap.set(normalized, { displayName: name, center });
        });
        setCountryCenters(centersMap);
        setGeoLoading(false);
      })
      .catch((err: Error) => {
        setGeoError(err.message);
        setGeoLoading(false);
      });
  }, []);

  const highlightedCountries = useMemo(() => {
    if (!selectedMonth || !countriesData) {
      return new Set<string>();
    }

    const availableNames = new Set(
      countriesData.features
        .map((feature) => normalizeCountryKey(String(feature.properties?.name ?? '')))
        .filter(Boolean)
    );

    const itemsForMonth = travelItems.filter((item) => item.month === selectedMonth);
    const countrySet = new Set<string>();

    itemsForMonth.forEach((item) => {
      const tokens = splitCountryField(item.country);
      tokens.forEach((token) => {
        const normalized = normalizeCountryKey(token);
        if (!normalized) return;
        const alias = aliasMap[normalized] ?? normalized;
        if (availableNames.has(alias)) {
          countrySet.add(alias);
        }
      });
    });

    return countrySet;
  }, [selectedMonth, travelItems, countriesData]);

  const selectedMonthOption = monthOptions.find((option) => option.value === selectedMonth);
  const highlightedCount = highlightedCountries.size;

  /**
   * Get color and opacity for a climate variant
   */
  const getClimateStyle = (variant: ClimateVariant): { fillColor: string; fillOpacity: number } => {
    switch (variant) {
      case 'summer':
        return { fillColor: '#fff600', fillOpacity: 0.6 };
      case 'winter':
        return { fillColor: '#00b7ff', fillOpacity: 0.6 };
      case 'mild':
        return { fillColor: '#b8ffb8', fillOpacity: 0.6 };
      case 'summer-winter':
        return { fillColor: '#99e6ff', fillOpacity: 0.7 };
      case 'summer-mild':
        return { fillColor: '#e8ff7a', fillOpacity: 0.7 };
      case 'winter-mild':
        return { fillColor: '#7adec9', fillOpacity: 0.7 };
      case 'mixed':
        return { fillColor: '#c9b3ff', fillOpacity: 0.7 };
      default:
        return { fillColor: '#ffffff', fillOpacity: 0.1 };
    }
  };

  // Helper to find matching country name in climate map
  const findCountryInClimateMap = (geoJsonName: string): string | null => {
    if (!selectedMonth || !monthCountryClimateMap[selectedMonth]) {
      return null;
    }

    const monthMap = monthCountryClimateMap[selectedMonth];
    
    // Try exact match first
    if (monthMap[geoJsonName]) {
      return geoJsonName;
    }

    // Try normalized match
    const normalized = normalizeCountryKey(geoJsonName);
    for (const [csvCountryName] of Object.entries(monthMap)) {
      const normalizedCsv = normalizeCountryKey(csvCountryName);
      if (normalized === normalizedCsv) {
        return csvCountryName;
      }
    }

    // Try with alias
    const alias = aliasMap[normalized];
    if (alias) {
      const normalizedAlias = normalizeCountryKey(alias);
      for (const [csvCountryName] of Object.entries(monthMap)) {
        const normalizedCsv = normalizeCountryKey(csvCountryName);
        if (normalizedAlias === normalizedCsv) {
          return csvCountryName;
        }
      }
    }

    return null;
  };

  const getFeatureStyle = (feature?: Feature) => {
    const name = String(feature?.properties?.name ?? '');
    const normalizedName = normalizeCountryKey(name);
    const isHighlighted = highlightedCountries.has(normalizedName);

    if (!isHighlighted) {
      // Non-active countries: neutral style
      return {
        fillColor: '#ffffff',
        fillOpacity: 0,
        color: '#111',
        weight: 0.4,
        opacity: 1,
      };
    }

    // Active country: find matching name in climate map and get variant
    const matchingCountryName = findCountryInClimateMap(name);
    const variant = matchingCountryName
      ? getClimateVariantForCountry(selectedMonth, matchingCountryName, monthCountryClimateMap)
      : null;
    const { fillColor, fillOpacity } = getClimateStyle(variant);

    return {
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      color: '#111',
      weight: 0.7,
      opacity: 1,
    };
  };

  const handleMonthSelect = (value: string) => {
    setSelectedMonth((prev) => (prev === value ? null : value));
  };

  const countryLabels = useMemo(() => {
    if (!selectedMonth) return [];
    return Array.from(highlightedCountries)
      .map((normalizedName) => {
        const centerInfo = countryCenters.get(normalizedName);
        if (!centerInfo) return null;
        return centerInfo;
      })
      .filter((info): info is CountryCenter => info !== null);
  }, [highlightedCountries, countryCenters, selectedMonth]);

  return (
    <div className="when-screen">
      {/* Map as full-screen background */}
      <div className="when-map-bg">
        {geoLoading && <div className="when-map-placeholder">טוען מפה...</div>}
        {geoError && <div className="when-map-error">שגיאה בטעינת המפה: {geoError}</div>}
        {!geoLoading && !geoError && countriesData && (
          <MapContainer center={[45, 0]} zoom={2} className="when-map" scrollWheelZoom={true}>
            <GeoJSON key={selectedMonth ?? 'base'} data={countriesData} style={getFeatureStyle} />
            {countryLabels.map((label) => (
              <Marker
                key={`label-${label.displayName}`}
                position={label.center}
                icon={createLabelIcon(label.displayName)}
                interactive={false}
              />
            ))}
          </MapContainer>
        )}
      </div>

      {/* UI content floating on top */}
      <div className="when-content">
        <button className="back-button" onClick={onBack} aria-label="חזרה">
          ←
        </button>
        <div className="when-month-grid">
          {monthOptions.map((option) => {
            const isActive = selectedMonth === option.value;
            return (
              <button
                key={option.value}
                className={`when-month-button ${isActive ? 'selected' : ''}`}
                onClick={() => handleMonthSelect(option.value)}
                dir="rtl"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function calculateFeatureCenter(geometry?: Geometry | null): [number, number] | null {
  if (!geometry) return null;

  const coords: [number, number][] = [];

  const addCoords = (points: number[][]) => {
    points.forEach(([lng, lat]) => {
      coords.push([lat, lng]);
    });
  };

  switch (geometry.type) {
    case 'Polygon':
      geometry.coordinates.forEach((ring) => addCoords(ring));
      break;
    case 'MultiPolygon':
      geometry.coordinates.forEach((poly) => {
        poly.forEach((ring) => addCoords(ring));
      });
      break;
    case 'GeometryCollection':
      geometry.geometries.forEach((geo) => {
        const center = calculateFeatureCenter(geo);
        if (center) {
          coords.push(center);
        }
      });
      break;
    default:
      break;
  }

  if (coords.length === 0) return null;

  const { latSum, lngSum } = coords.reduce(
    (acc, [lat, lng]) => ({
      latSum: acc.latSum + lat,
      lngSum: acc.lngSum + lng,
    }),
    { latSum: 0, lngSum: 0 }
  );

  return [latSum / coords.length, lngSum / coords.length];
}

function createLabelIcon(text: string): L.DivIcon {
  return L.divIcon({
    className: 'country-label-icon',
    html: `<span>${text}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}
