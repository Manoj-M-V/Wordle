const ANSWERS = require('./words/answers')
  .map((word) => word.trim().toLowerCase())
  .filter((word) => /^[a-z]{5}$/.test(word));
const isValidWord = require('./words/validWords');

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

module.exports = { getTodayWordInfo, getMsUntilNextWord, evaluateGuess, isValidWord };
