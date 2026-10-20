import React from 'react';

const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

export default function Keyboard({ onKey, onEnter, onDelete, letterStates }) {
  function handleKey(key) {
    if (key === 'ENTER') {
      onEnter();
    } else if (key === '⌫') {
      onDelete();
    } else {
      onKey(key);
    }
  }

  return (
    <div className="keyboard" role="group" aria-label="On-screen keyboard">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div className="keyboard__row" key={rowIndex}>
          {row.map((key) => {
            const state = letterStates[key];
            const className = [
              'key',
              key === 'ENTER' || key === '⌫' ? 'key--wide' : '',
              state === 'correct' ? 'key--correct' : '',
              state === 'present' ? 'key--present' : '',
              state === 'absent'  ? 'key--absent'  : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <button
                key={key}
                id={`key-${key.replace('⌫', 'backspace')}`}
                className={className}
                onClick={() => handleKey(key)}
                aria-label={key === '⌫' ? 'Backspace' : key}
              >
                {key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
