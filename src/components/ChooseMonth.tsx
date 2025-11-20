import { useState } from 'react';
import { months } from '../utils/constants';

interface ChooseMonthProps {
  onMonthSelected: (month: string) => void;
  onBack: () => void;
}

export function ChooseMonth({ onMonthSelected, onBack }: ChooseMonthProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const handleMonthClick = (month: string) => {
    setSelectedMonth(month);
  };

  const handleContinue = () => {
    if (selectedMonth) {
      onMonthSelected(selectedMonth);
    }
  };

  return (
    <div className="choose-screen">
      <button className="back-button" onClick={onBack} aria-label="Back">
        ←
      </button>
      <div className="choose-content">
        <h2 className="choose-title" dir="rtl">בחר חודש</h2>
        <div className="month-grid">
          {months.map((month) => (
            <button
              key={month}
              className={`month-option ${selectedMonth === month ? 'selected' : ''}`}
              onClick={() => handleMonthClick(month)}
            >
              {month}
            </button>
          ))}
        </div>
        <button
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedMonth}
        >
          <span dir="rtl">המשך</span>
        </button>
      </div>
    </div>
  );
}


