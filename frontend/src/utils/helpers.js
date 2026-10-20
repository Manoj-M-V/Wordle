// Utility helpers

/**
 * Generate the emoji grid for sharing results.
 */
export function generateShareText(guesses, wordNumber) {
  const emojiMap = {
    correct: '🟩',
    present: '🟨',
    absent: '⬛',
  };

  const lines = guesses.map((row) =>
    row.map((tile) => emojiMap[tile.status] || '⬜').join('')
  );

  return `Wordle #${wordNumber}\n${lines.join('\n')}`;
}

/**
 * Get the time remaining until next midnight UTC as a string HH:MM:SS.
 */
export function getTimeUntilMidnightUTC() {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  ));
  const diff = tomorrow.getTime() - now.getTime();

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':');
}
