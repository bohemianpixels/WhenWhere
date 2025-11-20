interface LandingProps {
  onChooseMonth: () => void;
  onChooseCategory: () => void;
}

export function Landing({ onChooseMonth, onChooseCategory }: LandingProps) {
  return (
    <div className="landing-screen">
      {/* Background Image */}
      <div className="landing-background-image"></div>

      {/* Main Content */}
      <div className="landing-content">
        <h1 className="landing-title">WhenWhere</h1>
        <p className="landing-subtitle" dir="rtl">
          החופשה שלך מתחילה כאן ועכשיו
        </p>
        <div className="landing-buttons">
          {/* WHEN button first in the DOM */}
          <button className="landing-button landing-button-when" onClick={onChooseMonth} dir="rtl">
            מתי
          </button>
          {/* WHERE button second in the DOM */}
          <button className="landing-button landing-button-where" onClick={onChooseCategory} dir="rtl">
            לאן
          </button>
        </div>
      </div>
    </div>
  );
}
