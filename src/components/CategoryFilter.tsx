import { CategoryKey, categories } from '../utils/categories';

interface CategoryFilterProps {
  selectedCategories: Set<CategoryKey>;
  onToggleCategory: (category: CategoryKey) => void;
}

export function CategoryFilter({ selectedCategories, onToggleCategory }: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <div className="category-chips">
        {(Object.keys(categories) as CategoryKey[]).map((categoryKey) => {
          const category = categories[categoryKey];
          const isSelected = selectedCategories.has(categoryKey);
          
          return (
            <button
              key={categoryKey}
              className={`category-chip ${isSelected ? 'active' : ''}`}
              onClick={() => onToggleCategory(categoryKey)}
              style={{
                '--category-color': category.color,
              } as React.CSSProperties}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-label">{category.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

