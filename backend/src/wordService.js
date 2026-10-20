const fs   = require('fs');
const path = require('path');

// ── Load the word list from the shared txt file ──────────────────────────────
// The file lives at the repo root: <project>/5-letter-words.txt
const WORDS_FILE = path.resolve(__dirname, '../../5-letter-words.txt');

let VALID_WORDS; // Set<string>  – lowercase
let ANSWERS;     // string[]     – lowercase (all 5-letter words make valid answers)

function loadWordList() {
  const raw = fs.readFileSync(WORDS_FILE, 'utf-8');
  const words = raw
    .split(/\r?\n/)
    .map((w) => w.trim().toLowerCase())
    .filter((w) => /^[a-z]{5}$/.test(w)); // keep only clean 5-letter words

  VALID_WORDS = new Set(words);
  ANSWERS     = words; // every word in the list is a potential answer
  console.log(`📖 Loaded ${VALID_WORDS.size} words from ${WORDS_FILE}`);
}

// Load immediately on require
loadWordList();

// Hot-reload when the file changes (useful during dev)
fs.watch(WORDS_FILE, () => {
  console.log('📖 Word list changed — reloading...');
  loadWordList();
});

/**
 * Get today's word based on UTC date.
 * Uses a deterministic index from the epoch so the same word appears all day.
 */
function getTodayWordInfo() {
  const now = new Date();
  // Create a date at midnight UTC
  const utcMidnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  // Epoch reference: Jan 1, 2024 (day 0)
  const epochStart = Date.UTC(2024, 0, 1);
  const dayIndex = Math.floor((utcMidnight - epochStart) / (1000 * 60 * 60 * 24));
  const wordIndex = ((dayIndex % ANSWERS.length) + ANSWERS.length) % ANSWERS.length;
  const word = ANSWERS[wordIndex].toUpperCase();

  return {
    word,
    wordNumber: dayIndex + 1,
    wordIndex,
    date: new Date(utcMidnight).toISOString().split('T')[0],
  };
}

/**
 * Get milliseconds until next midnight UTC.
 */
function getMsUntilNextWord() {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1
  ));
  return tomorrow.getTime() - now.getTime();
}

/**
 * Evaluate a guess against the answer.
 * Returns an array of result objects: { letter, status }
 * status: 'correct' | 'present' | 'absent'
 */
function evaluateGuess(guess, answer) {
  const guessArr = guess.toUpperCase().split('');
  const answerArr = answer.toUpperCase().split('');
  const result = Array(5).fill(null).map((_, i) => ({
    letter: guessArr[i],
    status: 'absent',
  }));

  // Track which answer letters are still available for yellow marking
  const answerLetterCount = {};
  answerArr.forEach((letter) => {
    answerLetterCount[letter] = (answerLetterCount[letter] || 0) + 1;
  });

  // First pass: find correct (green) letters
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === answerArr[i]) {
      result[i].status = 'correct';
      answerLetterCount[guessArr[i]]--;
    }
  }

  // Second pass: find present (yellow) letters
  for (let i = 0; i < 5; i++) {
    if (result[i].status !== 'correct') {
      const letter = guessArr[i];
      if (answerLetterCount[letter] && answerLetterCount[letter] > 0) {
        result[i].status = 'present';
        answerLetterCount[letter]--;
      }
    }
  }

  return result;
}

/**
 * Check if a word is valid (present in the loaded word list).
 */
function isValidWord(word) {
  return VALID_WORDS.has(word.toLowerCase());
}

module.exports = { getTodayWordInfo, getMsUntilNextWord, evaluateGuess, isValidWord };
