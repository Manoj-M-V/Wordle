const fs = require('fs');
const path = require('path');

const WORDS_FILE = path.resolve(__dirname, '../../../5-letter-words.txt');
const words = fs.readFileSync(WORDS_FILE, 'utf-8')
  .split(/\r?\n/)
  .map((word) => word.trim().toLowerCase())
  .filter((word) => /^[a-z]{5}$/.test(word));

const VALID_WORDS = new Set(words);

module.exports = VALID_WORDS;
