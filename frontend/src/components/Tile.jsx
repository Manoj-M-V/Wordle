import React from 'react';

export default function Tile({ letter, status, position, isRevealed }) {
  // Determine CSS class
  let className = 'tile';
  if (isRevealed && status) {
    className += ` tile--${status}`;
  } else if (letter) {
    className += ' tile--filled';
  }

  return (
    <div
      className={className}
      role="cell"
      aria-label={letter ? `${letter}${status ? `, ${status}` : ''}` : 'empty'}
      style={
        isRevealed && status
          ? { animationDelay: `${position * 0.1}s` }
          : {}
      }
    >
      {letter}
    </div>
  );
}
