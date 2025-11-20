import { useState } from 'react';
import { categories, CategoryKey } from '../utils/categories';

interface ChooseCategoryProps {
  onCategoriesSelected: (categories: Set<CategoryKey>) => void;
  onBack: () => void;
}

export function ChooseCategory({ onCategoriesSelected, onBack }: ChooseCategoryProps) {
  const [selectedCategories, setSelectedCategories] = useState<Set<CategoryKey>>(new Set());

  const handleCategoryToggle = (category: CategoryKey) => {
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

  const handleContinue = () => {
    if (selectedCategories.size > 0) {
      onCategoriesSelected(selectedCategories);
    }
  };

  return (
    <div className="choose-screen">
      <button className="back-button" onClick={onBack} aria-label="Back">
        ←
      </button>
      <div className="choose-content">
        <h2 className="choose-title" dir="rtl">בחר סגנון</h2>
        <div className="category-grid">
          {(Object.keys(categories) as CategoryKey[]).map((categoryKey) => {
            const category = categories[categoryKey];
            const isSelected = selectedCategories.has(categoryKey);
            
            return (
              <button
                key={categoryKey}
                className={`category-option ${isSelected ? 'selected' : ''}`}
                onClick={() => handleCategoryToggle(categoryKey)}
                style={{
                  '--category-color': category.color,
                } as React.CSSProperties}
              >
                <span className="category-option-icon">{category.icon}</span>
                <span className="category-option-label">{category.label}</span>
              </button>
            );
          })}
        </div>
        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={selectedCategories.size === 0}
        >
          <span dir="rtl">המשך</span>
        </button>
      </div>
    </div>
  );
}


