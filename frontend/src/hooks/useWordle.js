import { useState, useEffect, useCallback, useRef } from 'react';

const API_URL = '/api';
const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const STORAGE_KEY_STATE = 'wordle-game-state';

/**
 * Save/load game state to localStorage, keyed by word number.
 */
function loadGameState(wordNumber) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATE);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.wordNumber !== wordNumber) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveGameState(state) {
  try {
    localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function useWordle({ onGameEnd, hardMode }) {
  const [wordNumber, setWordNumber] = useState(null);
  const [guesses, setGuesses] = useState([]); // [{letter, status}[]][]
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing'); // 'playing' | 'won' | 'lost'
  const [toasts, setToasts] = useState([]);
  const [shakingRow, setShakingRow] = useState(null);
  const [bouncingRow, setBouncingRow] = useState(null);
  const [revealedAnswer, setRevealedAnswer] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Build keyboard letter state map
  const letterStates = {};
  for (const row of guesses) {
    for (const tile of row) {
      const existing = letterStates[tile.letter];
      // Priority: correct > present > absent
      if (existing === 'correct') continue;
      if (tile.status === 'correct' || existing !== 'present') {
        letterStates[tile.letter] = tile.status;
      }
    }
  }

  const toastIdRef = useRef(0);

  const showToast = useCallback((message, duration = 1800) => {
    const id = ++toastIdRef.current;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  // Load today's word number on mount
  useEffect(() => {
    async function init() {
      try {
        const res = await fetch(`${API_URL}/word/today`);
        const data = await res.json();
        setWordNumber(data.wordNumber);

        // Try to restore game state for today
        const saved = loadGameState(data.wordNumber);
        if (saved) {
          setGuesses(saved.guesses || []);
          setGameStatus(saved.gameStatus || 'playing');
          setRevealedAnswer(saved.revealedAnswer || null);
        }
      } catch (err) {
        showToast('Could not connect to server', 3000);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [showToast]);

  // Persist state whenever it changes
  useEffect(() => {
    if (wordNumber == null) return;
    saveGameState({ wordNumber, guesses, gameStatus, revealedAnswer });
  }, [wordNumber, guesses, gameStatus, revealedAnswer]);

  const submitGuess = useCallback(async () => {
    if (isRevealing) return;
    if (gameStatus !== 'playing') return;
    if (currentGuess.length !== WORD_LENGTH) {
      showToast('Not enough letters');
      setShakingRow(guesses.length);
      setTimeout(() => setShakingRow(null), 600);
      return;
    }

    // Hard mode check: enforce using revealed letters
    if (hardMode) {
      for (const row of guesses) {
        for (const tile of row) {
          if (tile.status === 'correct') {
            const expectedIndex = row.indexOf(tile);
            if (currentGuess[expectedIndex] !== tile.letter) {
              showToast(`${tile.letter} must be in position ${expectedIndex + 1}`, 2000);
              setShakingRow(guesses.length);
              setTimeout(() => setShakingRow(null), 600);
              return;
            }
          }
          if (tile.status === 'present') {
            if (!currentGuess.includes(tile.letter)) {
              showToast(`Guess must contain ${tile.letter}`, 2000);
              setShakingRow(guesses.length);
              setTimeout(() => setShakingRow(null), 600);
              return;
            }
          }
        }
      }
    }

    try {
      const res = await fetch(`${API_URL}/word/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess: currentGuess }),
      });

      if (res.status === 422) {
        showToast('Not a valid word');
        setShakingRow(guesses.length);
        setTimeout(() => setShakingRow(null), 600);
        return;
      }

      if (!res.ok) {
        const err = await res.json();
        showToast(err.error || 'Error submitting guess');
        return;
      }

      const data = await res.json();
      const newGuesses = [...guesses, data.result];
      setGuesses(newGuesses);
      setCurrentGuess('');
      setIsRevealing(true);

      // Wait for flip animation to finish before checking game state
      const revealTime = (WORD_LENGTH - 1) * 100 + 500;
      setTimeout(async () => {
        setIsRevealing(false);

        if (data.isWin) {
          setGameStatus('won');
          const winMessages = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
          showToast(winMessages[Math.min(guesses.length, 5)], 2500);
          setBouncingRow(newGuesses.length - 1);
          setTimeout(() => setBouncingRow(null), 1000);
          onGameEnd?.({ won: true, guesses: newGuesses, guessCount: newGuesses.length, wordNumber: data.wordNumber });
        } else if (newGuesses.length >= MAX_GUESSES) {
          setGameStatus('lost');
          // Reveal the answer
          try {
            const revRes = await fetch(`${API_URL}/word/reveal`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ attempts: MAX_GUESSES }),
            });
            const revData = await revRes.json();
            setRevealedAnswer(revData.answer);
            showToast(revData.answer, 4000);
          } catch {
            showToast('Better luck next time!', 3000);
          }
          onGameEnd?.({ won: false, guesses: newGuesses, guessCount: newGuesses.length, wordNumber: data.wordNumber });
        }
      }, revealTime);
    } catch (err) {
      showToast('Network error. Is the backend running?', 3000);
    }
  }, [currentGuess, guesses, gameStatus, hardMode, isRevealing, showToast, onGameEnd, wordNumber]);

  const addLetter = useCallback((letter) => {
    if (isRevealing) return;
    if (gameStatus !== 'playing') return;
    if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess((prev) => prev + letter.toUpperCase());
    }
  }, [currentGuess, gameStatus, isRevealing]);

  const removeLetter = useCallback(() => {
    if (isRevealing) return;
    if (gameStatus !== 'playing') return;
    setCurrentGuess((prev) => prev.slice(0, -1));
  }, [gameStatus, isRevealing]);

  return {
    guesses,
    currentGuess,
    gameStatus,
    toasts,
    shakingRow,
    bouncingRow,
    revealedAnswer,
    isRevealing,
    loading,
    letterStates,
    wordNumber,
    addLetter,
    removeLetter,
    submitGuess,
    showToast,
  };
}
