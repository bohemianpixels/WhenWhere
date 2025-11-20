import { months } from '../utils/constants';

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="month-selector">
      <h2 className="section-title">Select Month</h2>
      <div className="month-chips">
        {months.map((month) => (
          <button
            key={month}
            className={`month-chip ${selectedMonth === month ? 'active' : ''}`}
            onClick={() => onMonthChange(month)}
          >
            {month}
          </button>
        ))}
      </div>
    </div>
  );
}

