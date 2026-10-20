import React from 'react';
import Row from './Row';

const WORD_LENGTH = 5;
const MAX_GUESSES = 6;

export default function Board({ guesses, currentGuess, gameStatus, shakingRow, bouncingRow }) {
  const rows = [];

  // Completed guess rows
  for (let i = 0; i < guesses.length; i++) {
    rows.push(
      <Row
        key={`guess-${i}`}
        tiles={guesses[i]}
        isShaking={shakingRow === i}
        isBouncing={bouncingRow === i}
        isRevealed={true}
      />
    );
  }

  // Current active row (while typing)
  if (guesses.length < MAX_GUESSES && gameStatus === 'playing') {
    const activeTiles = Array.from({ length: WORD_LENGTH }, (_, j) => ({
      letter: currentGuess[j] || '',
      status: null,
    }));
    rows.push(
      <Row
        key="current"
        tiles={activeTiles}
        isShaking={shakingRow === guesses.length}
        isBouncing={false}
        isRevealed={false}
      />
    );
  }

  // Empty rows
  while (rows.length < MAX_GUESSES) {
    const emptyTiles = Array.from({ length: WORD_LENGTH }, () => ({ letter: '', status: null }));
    rows.push(
      <Row
        key={`empty-${rows.length}`}
        tiles={emptyTiles}
        isShaking={false}
        isBouncing={false}
        isRevealed={false}
      />
    );
  }

  return (
    <div className="board-container">
      <div className="board" role="grid" aria-label="Wordle game board">
        {rows}
      </div>
    </div>
  );
}
