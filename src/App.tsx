import { useState, useEffect, useMemo } from 'react';
import { TravelItem } from './types';
import { loadTravelData } from './data/loadTravelData';
import { MonthSelector } from './components/MonthSelector';
import { WorldMap } from './components/WorldMap';
import { DestinationPanel } from './components/DestinationPanel';
import { CategoryFilter } from './components/CategoryFilter';
import { Landing } from './components/Landing';
import { ChooseCategory } from './components/ChooseCategory';
import { WhenScreen } from './components/WhenScreen';
import { getCurrentMonth } from './utils/constants';
import { CategoryKey } from './utils/categories';
import { buildMonthCountryClimateMap, MonthCountryClimateMap } from './utils/climate';
import './App.css';

type FlowMode = 'landing' | 'when' | 'chooseCategory' | 'map';

function App() {
  const [data, setData] = useState<TravelItem[]>([]);
  const [mode, setMode] = useState<FlowMode>('landing');
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [selectedItem, setSelectedItem] = useState<TravelItem | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryKey>>(
    new Set(['beach', 'ski', 'city', 'trekking', 'safari', 'festival', 'polar', 'other'])
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTravelData()
      .then((loadedData) => {
        setData(loadedData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Build month → country → climate summary map
  const monthCountryClimateMap = useMemo<MonthCountryClimateMap>(() => {
    return buildMonthCountryClimateMap(data);
  }, [data]);

  const handleToggleCategory = (category: CategoryKey) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const filteredItems = data.filter(
    (item) => item.month === selectedMonth
  );

  const handleMarkerClick = (item: TravelItem) => {
    setSelectedItem(item);
  };

  const handlePrevious = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(
      (item) =>
        item.month === selectedItem.month &&
        item.destination === selectedItem.destination &&
        item.country === selectedItem.country
    );
    if (currentIndex > 0) {
      setSelectedItem(filteredItems[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (!selectedItem) return;
    const currentIndex = filteredItems.findIndex(
      (item) =>
        item.month === selectedItem.month &&
        item.destination === selectedItem.destination &&
        item.country === selectedItem.country
    );
    if (currentIndex < filteredItems.length - 1) {
      setSelectedItem(filteredItems[currentIndex + 1]);
    }
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  // Update selected item when month changes
  useEffect(() => {
    setSelectedItem(null);
  }, [selectedMonth]);

  const handleCategoriesSelected = (categories: Set<CategoryKey>) => {
    setSelectedCategories(categories);
    setMode('map');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <p>Loading travel data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-error">
        <p>Error loading data: {error}</p>
      </div>
    );
  }

  // Landing screen
  if (mode === 'landing') {
    return (
      <Landing
        onChooseMonth={() => setMode('when')}
        onChooseCategory={() => setMode('chooseCategory')}
      />
    );
  }

  if (mode === 'when') {
    return (
      <WhenScreen
        travelItems={data}
        monthCountryClimateMap={monthCountryClimateMap}
        onBack={() => setMode('landing')}
      />
    );
  }

  // Choose Category screen
  if (mode === 'chooseCategory') {
    return (
      <ChooseCategory
        onCategoriesSelected={handleCategoriesSelected}
        onBack={() => setMode('landing')}
      />
    );
  }

  // Map screen (existing functionality)
  return (
    <div className="app">
      <header className="app-header">
        <button className="back-to-landing-button" onClick={() => setMode('landing')}>
          ← WhenWhere
        </button>
        <h1 className="app-title">WhenWhere</h1>
      </header>
      <div className="app-content">
        <aside className="sidebar">
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
          <CategoryFilter
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
          />
        </aside>
        <main className="main-content">
          <div className="map-wrapper">
            <WorldMap
              items={filteredItems}
              selectedCategories={selectedCategories}
              onMarkerClick={handleMarkerClick}
            />
          </div>
        </main>
        {selectedItem && (
          <DestinationPanel
            selectedItem={selectedItem}
            allItems={filteredItems}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onClose={handleClose}
          />
        )}
      </div>
    </div>
  );
}

export default App;

