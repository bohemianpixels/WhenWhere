# Travel by Month

An interactive web application for exploring travel recommendations organized by month, featuring a world map with clickable markers and detailed destination information.

## Tech Stack

- **React** + **TypeScript** + **Vite** - Modern frontend framework
- **Leaflet** + **react-leaflet** - Interactive world map
- **Papaparse** - CSV parsing
- Simple CSS for styling (no heavy design system)

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the App

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173` (or the port Vite assigns).

## Project Structure

```
src/
  ├── main.tsx              # Entry point
  ├── App.tsx               # Root component with state management
  ├── App.css               # Main styles
  ├── types.ts              # TypeScript type definitions
  ├── components/
  │   ├── MonthSelector.tsx # Month selection UI
  │   ├── WorldMap.tsx      # Leaflet map with markers
  │   └── DestinationPanel.tsx # Details panel with navigation
  ├── data/
  │   ├── loadTravelData.ts # CSV loading utility
  │   └── coordinates.ts    # Coordinate mappings
  └── utils/
      └── constants.ts      # Constants (months, etc.)

public/
  └── travel_by_month_clean.csv  # Travel data file
```

## Data File

The CSV file should be located at:
```
public/travel_by_month_clean.csv
```

The CSV has the following columns:
- `month` - Month name (January, February, ..., December)
- `destination` - Specific area or region
- `country` - Country or main region
- `category_raw` - Category (e.g., "Beach / Warm escape", "Trekking / Mountains")
- `reason_he` - Hebrew explanation for the recommendation

## Extending Coordinates

To add or update coordinates for destinations, edit the file:
```
src/data/coordinates.ts
```

### Destination-Specific Coordinates

Add entries to the `destinationCoords` object:
```typescript
export const destinationCoords: Record<string, Coordinates> = {
  "Your Destination": { lat: 40.7, lng: -74.0 },
  // ... more destinations
};
```

### Country Fallback Coordinates

If a destination doesn't have specific coordinates, the app will try to use country-level coordinates from the `countryCoords` object:
```typescript
export const countryCoords: Record<string, Coordinates> = {
  "Your Country": { lat: 40.7, lng: -74.0 },
  // ... more countries
};
```

The `getCoordinates()` function automatically:
1. First checks for destination-specific coordinates
2. Falls back to country coordinates
3. Returns `null` if neither is found (marker won't be rendered)

## Features

- **Month Selection**: Choose any month to see destinations for that time
- **Interactive Map**: Click markers to see destination details
- **Details Panel**: View destination information with Hebrew text (RTL support)
- **Navigation**: Browse through multiple destinations in the same month with Previous/Next buttons
- **Responsive Design**: Works on desktop and mobile devices

## Future Enhancements

The codebase is structured to easily add:
- Category filters (beach/ski/trekking/safari/festival)
- Search functionality
- Additional filters (temperature, budget, etc.)
- Direct coordinate editing in the UI

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

