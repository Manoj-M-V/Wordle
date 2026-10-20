import { useState, useCallback } from 'react';

const STORAGE_KEY = 'wordle-stats';

const DEFAULT_STATS = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 },
  lastWonWordNumber: null,
  lastPlayedWordNumber: null,
};

function loadStats() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_STATS, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_STATS };
}

function saveStats(stats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export function useStats() {
  const [stats, setStats] = useState(loadStats);

  const recordGame = useCallback((won, guessCount, wordNumber) => {
    setStats((prev) => {
      const alreadyPlayed = prev.lastPlayedWordNumber === wordNumber;
      if (alreadyPlayed) return prev; // Don't double-count

      const gamesPlayed = prev.gamesPlayed + 1;
      const gamesWon = won ? prev.gamesWon + 1 : prev.gamesWon;

      // Calculate streak
      const isConsecutive = prev.lastWonWordNumber === wordNumber - 1;
      let currentStreak = prev.currentStreak;
      if (won) {
        currentStreak = isConsecutive ? currentStreak + 1 : 1;
      } else {
        currentStreak = 0;
      }
      const maxStreak = Math.max(prev.maxStreak, currentStreak);

      // Update distribution
      const guessDistribution = { ...prev.guessDistribution };
      if (won && guessCount >= 1 && guessCount <= 6) {
        guessDistribution[guessCount] = (guessDistribution[guessCount] || 0) + 1;
      }

      const updated = {
        gamesPlayed,
        gamesWon,
        currentStreak,
        maxStreak,
        guessDistribution,
        lastPlayedWordNumber: wordNumber,
        lastWonWordNumber: won ? wordNumber : prev.lastWonWordNumber,
      };

      saveStats(updated);
      return updated;
    });
  }, []);

  const winPercentage = stats.gamesPlayed > 0
    ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100)
    : 0;

  return { stats, winPercentage, recordGame };
}
