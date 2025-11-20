import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TravelItem } from '../types';
import { getCoordinates } from '../data/coordinates';
import { getCategoryFromString, categories, CategoryKey } from '../utils/categories';
import 'leaflet/dist/leaflet.css';

interface WorldMapProps {
  items: TravelItem[];
  selectedCategories: Set<CategoryKey>;
  onMarkerClick: (item: TravelItem) => void;
}

// Create custom category markers
function createCategoryIcon(categoryKey: CategoryKey): L.DivIcon {
  const category = categories[categoryKey];
  const size = 32;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-circle" style="background-color: ${category.color};">
        <span class="marker-emoji">${category.icon}</span>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

function MapUpdater({ items }: { items: TravelItem[] }) {
  const map = useMap();
  
  useEffect(() => {
    const coords = items
      .map(item => getCoordinates(item.destination, item.country))
      .filter((coord): coord is { lat: number; lng: number } => coord !== null);
    
    if (coords.length > 0) {
      const bounds = L.latLngBounds(coords);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      // Default view if no valid coordinates
      map.setView([20, 0], 2);
    }
  }, [items, map]);
  
  return null;
}

export function WorldMap({ items, selectedCategories, onMarkerClick }: WorldMapProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Filter items by category and that have valid coordinates
  const itemsWithCoords = items
    .map(item => {
      const category = getCategoryFromString(item.category_raw);
      return {
        item,
        category,
        coords: getCoordinates(item.destination, item.country),
      };
    })
    .filter(({ coords, category }) => 
      coords !== null && selectedCategories.has(category)
    );

  // Trigger fade animation when items change
  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => setIsTransitioning(false), 350);
    return () => clearTimeout(timer);
  }, [items.length, selectedCategories.size]);

  return (
    <div className={`world-map-container ${isTransitioning ? 'transitioning' : ''}`}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater items={itemsWithCoords.map(({ item }) => item)} />
        {itemsWithCoords.map(({ item, category, coords }) => (
          <Marker
            key={`${item.month}-${item.destination}-${item.country}`}
            position={[coords!.lat, coords!.lng]}
            icon={createCategoryIcon(category)}
            eventHandlers={{
              click: () => onMarkerClick(item),
            }}
          >
            <Popup className="custom-popup">
              <div>
                <strong>{item.destination}</strong>
                <br />
                {item.country}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

