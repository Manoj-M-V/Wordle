import React, { useState, useEffect, useCallback } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { useWordle } from './hooks/useWordle';
import { useStats } from './hooks/useStats';
import Header from './components/Header';
import Board from './components/Board';
import Keyboard from './components/Keyboard';
import Toast from './components/Toast';
import HelpModal from './components/HelpModal';
import StatsModal from './components/StatsModal';
import Confetti from './components/Confetti';

function WordleGame() {
  const [helpOpen, setHelpOpen] = useState(false);
  const [statsOpen, setStatsOpen] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [hardMode, setHardMode] = useState(() => {
    return localStorage.getItem('wordle-hard-mode') === 'true';
  });

  const { stats, winPercentage, recordGame } = useStats();

  const handleGameEnd = useCallback(({ won, guesses, guessCount, wordNumber }) => {
    recordGame(won, guessCount, wordNumber);
    if (won) {
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 4000);
    }
    // Auto-open stats after a short delay
    setTimeout(() => setStatsOpen(true), 2000);
  }, [recordGame]);

  const {
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
  } = useWordle({ onGameEnd: handleGameEnd, hardMode });

  // ── Physical keyboard listener ─────────────────────────────────────────────
  useEffect(() => {
    function handleKeyDown(e) {
      // Ignore if any modifier key is held (prevent browser shortcuts)
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      // Ignore if a modal is open and the key is not Escape
      if ((helpOpen || statsOpen) && e.key !== 'Escape') return;

      const key = e.key;
      if (key === 'Enter') {
        submitGuess();
      } else if (key === 'Backspace') {
        removeLetter();
      } else if (/^[a-zA-Z]$/.test(key)) {
        addLetter(key.toUpperCase());
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addLetter, removeLetter, submitGuess, helpOpen, statsOpen]);

  // ── Hard Mode toggle ───────────────────────────────────────────────────────
  function toggleHardMode() {
    if (guesses.length > 0) {
      showToast('Hard mode can only be enabled at the start of a round', 2500);
      return;
    }
    const next = !hardMode;
    setHardMode(next);
    localStorage.setItem('wordle-hard-mode', String(next));
    showToast(next ? 'Hard Mode ON 🔥' : 'Hard Mode OFF', 1500);
  }

  // ── Show help on first visit ───────────────────────────────────────────────
  useEffect(() => {
    const hasPlayed = localStorage.getItem('wordle-has-played');
    if (!hasPlayed) {
      setHelpOpen(true);
      localStorage.setItem('wordle-has-played', 'true');
    }
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
        <p>Connecting to server...</p>
      </div>
    );
  }

  return (
    <>
      <Header
        onHelpOpen={() => setHelpOpen(true)}
        onStatsOpen={() => setStatsOpen(true)}
        wordNumber={wordNumber}
        hardMode={hardMode}
      />

      <main className="game-wrapper">
        <Board
          guesses={guesses}
          currentGuess={currentGuess}
          gameStatus={gameStatus}
          shakingRow={shakingRow}
          bouncingRow={bouncingRow}
        />

        <Keyboard
          onKey={addLetter}
          onEnter={submitGuess}
          onDelete={removeLetter}
          letterStates={letterStates}
        />
      </main>

      {/* Toasts */}
      <Toast toasts={toasts} />

      {/* Confetti */}
      <Confetti active={confettiActive} />

      {/* Modals */}
      <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} />

      <StatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        stats={stats}
        winPercentage={winPercentage}
        guesses={guesses}
        wordNumber={wordNumber}
        gameStatus={gameStatus}
        revealedAnswer={revealedAnswer}
        hardMode={hardMode}
        onToggleHardMode={toggleHardMode}
      />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WordleGame />
    </ThemeProvider>
  );
}
