import React, { useState, useEffect } from 'react';
import { getTimeUntilMidnightUTC } from '../utils/helpers';

export default function Countdown() {
  const [time, setTime] = useState(getTimeUntilMidnightUTC());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(getTimeUntilMidnightUTC());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown-section">
      <div className="countdown-section__label">Next Word</div>
      <div className="countdown-section__timer">{time}</div>
    </div>
  );
}
