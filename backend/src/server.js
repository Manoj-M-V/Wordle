require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getTodayWordInfo, evaluateGuess, isValidWord } = require('./wordService');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

// ─── API Routes ────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get today's game info (word number, date) — does NOT reveal the word
app.get('/api/word/today', (req, res) => {
  const { wordNumber, date } = getTodayWordInfo();
  res.json({ wordNumber, date });
});

// Get word length (always 5 for Wordle)
app.get('/api/word/length', (req, res) => {
  res.json({ length: 5 });
});

// Validate a word — checks if it's a real word
app.get('/api/word/validate/:word', (req, res) => {
  const { word } = req.params;
  if (!word || word.length !== 5) {
    return res.status(400).json({ valid: false, message: 'Word must be exactly 5 letters' });
  }
  const valid = isValidWord(word);
  res.json({ valid });
});

// Submit a guess and get color feedback
app.post('/api/word/guess', (req, res) => {
  const { guess } = req.body;

  if (!guess || typeof guess !== 'string') {
    return res.status(400).json({ error: 'Guess is required' });
  }

  const cleanGuess = guess.trim().toUpperCase();

  if (cleanGuess.length !== 5) {
    return res.status(400).json({ error: 'Guess must be exactly 5 letters' });
  }

  if (!/^[A-Z]{5}$/.test(cleanGuess)) {
    return res.status(400).json({ error: 'Guess must contain only letters' });
  }

  if (!isValidWord(cleanGuess)) {
    return res.status(422).json({ error: 'Not in word list' });
  }

  const { word, wordNumber, date } = getTodayWordInfo();
  const result = evaluateGuess(cleanGuess, word);
  const isWin = result.every((r) => r.status === 'correct');

  const response = {
    result,
    isWin,
    wordNumber,
    date,
  };

  // Only reveal the answer if the game is over (either won or we need to reveal on loss)
  // The client tracks attempt count; we reveal the answer only when asked explicitly
  if (req.body.revealAnswer === true) {
    response.answer = word;
  }

  res.json(response);
});

// Reveal answer (used when player has used all 6 guesses)
app.post('/api/word/reveal', (req, res) => {
  const { attempts } = req.body;
  if (typeof attempts !== 'number' || attempts < 6) {
    return res.status(403).json({ error: 'Answer cannot be revealed yet' });
  }
  const { word, wordNumber, date } = getTodayWordInfo();
  res.json({ answer: word, wordNumber, date });
});

// ─── Start Server ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  const { word, wordNumber, date } = getTodayWordInfo();
  console.log(`\n🟩 Wordle Backend running on http://localhost:${PORT}`);
  console.log(`📅 Today's word #${wordNumber} (${date}): ${word}`);
  console.log(`⏰ Word changes daily at 12:00 AM UTC\n`);
});

module.exports = app;
