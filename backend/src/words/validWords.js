const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';

async function isValidWord(word) {
  if (typeof word !== 'string') {
    return false;
  }

  const normalizedWord = word.trim().toLowerCase();
  if (!/^[a-z]{5}$/.test(normalizedWord)) {
    return false;
  }

  const response = await fetch(
    `${DICTIONARY_API_URL}/${encodeURIComponent(normalizedWord)}`,
    { signal: AbortSignal.timeout(5000) }
  );

  if (response.status === 404) {
    return false;
  }

  if (!response.ok) {
    throw new Error(`Dictionary API returned status ${response.status}`);
  }

  const entries = await response.json();
  if (!Array.isArray(entries)) {
    throw new Error('Dictionary API returned an invalid response');
  }

  return entries.some((entry) =>
    typeof entry?.word === 'string' &&
    entry.word.toLowerCase() === normalizedWord
  );
}

module.exports = isValidWord;
