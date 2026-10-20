import React from 'react';
import Modal from './Modal';
import Countdown from './Countdown';
import { generateShareText } from '../utils/helpers';

export default function StatsModal({ isOpen, onClose, stats, winPercentage, guesses, wordNumber, gameStatus, revealedAnswer }) {
  const maxDist = Math.max(...Object.values(stats.guessDistribution), 1);
  const currentGuessCount = gameStatus === 'won' ? guesses.length : null;

  function handleShare() {
    const text = generateShareText(guesses, wordNumber);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        // Could show toast from here, but it's inside modal
      });
    }
    // Fallback: create a temporary textarea
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    alert('Results copied to clipboard! 📋');
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Statistics">
      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-card__value">{stats.gamesPlayed}</span>
          <span className="stat-card__label">Played</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{winPercentage}</span>
          <span className="stat-card__label">Win %</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{stats.currentStreak}</span>
          <span className="stat-card__label">Current Streak</span>
        </div>
        <div className="stat-card">
          <span className="stat-card__value">{stats.maxStreak}</span>
          <span className="stat-card__label">Max Streak</span>
        </div>
      </div>

      {/* Guess Distribution */}
      <div className="guess-distribution">
        <div className="guess-distribution__title">Guess Distribution</div>
        {[1, 2, 3, 4, 5, 6].map((num) => {
          const count = stats.guessDistribution[num] || 0;
          const widthPct = Math.max((count / maxDist) * 100, 7);
          const isCurrent = currentGuessCount === num;
          return (
            <div className="dist-row" key={num}>
              <span className="dist-row__num">{num}</span>
              <div className="dist-row__bar-container">
                <div
                  className={`dist-row__bar${isCurrent ? ' dist-row__bar--current' : ''}`}
                  style={{ width: `${widthPct}%` }}
                >
                  {count}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share area — only show when game is complete */}
      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <div className="share-area">
          {revealedAnswer && gameStatus === 'lost' && (
            <div className="share-area__answer">
              The word was <span>{revealedAnswer}</span>
            </div>
          )}
          <div className="share-row">
            <Countdown />
            <button
              id="btn-share"
              className="btn-share"
              onClick={handleShare}
              aria-label="Share your result"
            >
              Share 🔗
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
