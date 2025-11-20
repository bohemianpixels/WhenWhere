import { TravelItem } from '../types';

interface DestinationPanelProps {
  selectedItem: TravelItem | null;
  allItems: TravelItem[];
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

export function DestinationPanel({
  selectedItem,
  allItems,
  onPrevious,
  onNext,
  onClose,
}: DestinationPanelProps) {
  if (!selectedItem) {
    return null;
  }

  const currentIndex = allItems.findIndex(
    (item) =>
      item.month === selectedItem.month &&
      item.destination === selectedItem.destination &&
      item.country === selectedItem.country
  );

  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < allItems.length - 1;

  return (
    <div className="destination-panel">
      <button className="close-button" onClick={onClose} aria-label="Close">
        ×
      </button>
      <div className="panel-content">
        <div className="panel-header">
          <h2 className="destination-title">{selectedItem.destination}</h2>
          <p className="country">{selectedItem.country}</p>
          <p className="month-category">
            <span className="month-badge">{selectedItem.month}</span>
            <span className="category-badge">{selectedItem.category_raw}</span>
          </p>
        </div>
        <div className="panel-body">
          <div className="reason-hebrew" dir="rtl">
            {selectedItem.reason_he}
          </div>
        </div>
        <div className="panel-footer">
          <button
            className="nav-arrow nav-arrow-left"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            aria-label="Previous"
          >
            ←
          </button>
          <span className="item-counter">
            {currentIndex + 1} of {allItems.length}
          </span>
          <button
            className="nav-arrow nav-arrow-right"
            onClick={onNext}
            disabled={!canGoNext}
            aria-label="Next"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}

