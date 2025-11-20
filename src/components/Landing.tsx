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
          <button className="landing-button" onClick={onChooseCategory} dir="rtl">
            לאן
          </button>
          <button className="landing-button" onClick={onChooseMonth} dir="rtl">
            מתי
          </button>
        </div>
      </div>
    </div>
  );
}
