import React, { useEffect, useState } from 'react';

const COLORS = ['#538d4e', '#b59f3b', '#4dabf7', '#f06595', '#a9e34b', '#fcc419', '#ff6b6b'];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

export default function Confetti({ active }) {
  const [pieces, setPieces] = useState([]);

  useEffect(() => {
    if (!active) {
      setPieces([]);
      return;
    }

    const newPieces = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: `${randomBetween(0, 100)}%`,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: `${randomBetween(1.8, 3.5)}s`,
      delay: `${randomBetween(0, 0.8)}s`,
      width: `${randomBetween(6, 14)}px`,
      height: `${randomBetween(10, 18)}px`,
      rotation: Math.random() > 0.5 ? 'skewX(15deg)' : 'skewY(15deg)',
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => setPieces([]), 4000);
    return () => clearTimeout(timer);
  }, [active]);

  if (pieces.length === 0) return null;

  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map((p) => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{
            left: p.left,
            backgroundColor: p.color,
            width: p.width,
            height: p.height,
            animationDuration: p.duration,
            animationDelay: p.delay,
            transform: p.rotation,
          }}
        />
      ))}
    </div>
  );
}
