// Category definitions with icons and colors
// You can easily change the icons (emojis) or colors here to match your brand

export type CategoryKey = 
  | 'beach' 
  | 'ski' 
  | 'city' 
  | 'trekking' 
  | 'safari' 
  | 'festival' 
  | 'polar'
  | 'other';

export interface CategoryInfo {
  icon: string;
  label: string;
  color: string;
  keywords: string[];
}

export const categories: Record<CategoryKey, CategoryInfo> = {
  beach: {
    icon: '☀️',
    label: 'Beach',
    color: '#FFD93D', // Warm yellow
    keywords: ['beach', 'warm escape', 'island', 'water', 'coast', 'maldives', 'caribbean', 'seychelles'],
  },
  ski: {
    icon: '🎿',
    label: 'Ski',
    color: '#6BCAE2', // Cool blue
    keywords: ['ski', 'winter sports', 'snow', 'alps', 'winter'],
  },
  city: {
    icon: '🏙',
    label: 'City',
    color: '#FF6B6B', // Coral red
    keywords: ['city', 'culture', 'historical', 'urban', 'romance'],
  },
  trekking: {
    icon: '🥾',
    label: 'Trekking',
    color: '#51CF66', // Green
    keywords: ['trekking', 'mountains', 'hiking', 'trail', 'himalaya', 'patagonia', 'peru', 'nepal'],
  },
  safari: {
    icon: '🐘',
    label: 'Safari',
    color: '#FFA94D', // Orange
    keywords: ['safari', 'wildlife', 'nature', 'animals', 'kenya', 'tanzania', 'africa'],
  },
  festival: {
    icon: '🎉',
    label: 'Festival',
    color: '#C44569', // Pink
    keywords: ['festival', 'carnival', 'party', 'celebration', 'oktoberfest', 'holi'],
  },
  polar: {
    icon: '❄️',
    label: 'Polar',
    color: '#A8E6CF', // Light green-blue
    keywords: ['polar', 'arctic', 'antarctica', 'northern lights', 'expedition', 'ice'],
  },
  other: {
    icon: '📍',
    label: 'Other',
    color: '#95A5A6', // Gray
    keywords: [],
  },
};

// Determine category from category_raw string
export function getCategoryFromString(categoryRaw: string): CategoryKey {
  const lower = categoryRaw.toLowerCase();
  
  for (const [key, info] of Object.entries(categories)) {
    if (key === 'other') continue;
    if (info.keywords.some(keyword => lower.includes(keyword))) {
      return key as CategoryKey;
    }
  }
  
  return 'other';
}

