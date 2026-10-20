import React from 'react';
import Modal from './Modal';

export default function HelpModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How to Play">
      <div className="help-section">
        <p>
          Guess the <strong>WORDLE</strong> in 6 tries. Each guess must be a valid
          5-letter word. Hit the Enter button to submit.
        </p>
      </div>

      <div className="help-section">
        <p>After each guess, the color of the tiles will change to show how close
          your guess was to the word.</p>
      </div>

      <div className="help-section">
        <h3>Examples</h3>

        {/* Correct */}
        <div className="help-example">
          <div className="help-tile help-tile--correct">W</div>
          <div className="help-tile">E</div>
          <div className="help-tile">A</div>
          <div className="help-tile">R</div>
          <div className="help-tile">Y</div>
        </div>
        <p className="help-caption">
          <strong>W</strong> is in the word and in the correct spot.
        </p>

        {/* Present */}
        <div className="help-example">
          <div className="help-tile">P</div>
          <div className="help-tile help-tile--present">I</div>
          <div className="help-tile">L</div>
          <div className="help-tile">L</div>
          <div className="help-tile">S</div>
        </div>
        <p className="help-caption">
          <strong>I</strong> is in the word but in the wrong spot.
        </p>

        {/* Absent */}
        <div className="help-example">
          <div className="help-tile">V</div>
          <div className="help-tile">A</div>
          <div className="help-tile">G</div>
          <div className="help-tile help-tile--absent">U</div>
          <div className="help-tile">E</div>
        </div>
        <p className="help-caption">
          <strong>U</strong> is not in the word in any spot.
        </p>
      </div>

      <div className="help-section">
        <p>
          🕛 A new word drops every day at <strong>midnight UTC</strong>!
        </p>
      </div>

      <div className="help-section">
        <p>
          🔥 <strong>Hard Mode</strong>: Any revealed hints must be used in subsequent guesses.
          Toggle it from the header.
        </p>
      </div>
    </Modal>
  );
}
