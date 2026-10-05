import { ChatIntent } from '../types';
import { CHAT_INTENTS, FALLBACK_INTENT } from './intents';

interface MatchResult {
  intent: ChatIntent;
  score: number;
  matchedKeywords: string[];
}

/**
 * Clean and normalize raw user text
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // replace punctuation with spaces
    .replace(/\s+/g, ' ')     // collapse multiple spaces
    .trim();
};

/**
 * Score an intent against normalized input text
 */
const scoreIntent = (normalizedInput: string, intent: ChatIntent): MatchResult => {
  let score = 0;
  const matchedKeywords: string[] = [];
  const inputWords = normalizedInput.split(' ');

  for (const keyword of intent.keywords) {
    const normalizedKeyword = normalizeText(keyword);

    // Exact full phrase match (highest weight)
    if (normalizedInput === normalizedKeyword) {
      score += 100;
      matchedKeywords.push(keyword);
      continue;
    }

    // Substring phrase match (e.g. input contains "pilot training")
    if (normalizedInput.includes(normalizedKeyword)) {
      // Longer keyword phrases carry more specific intent weight
      const wordCount = normalizedKeyword.split(' ').length;
      score += 20 * wordCount;
      matchedKeywords.push(keyword);
      continue;
    }

    // Individual word matching
    const keywordWords = normalizedKeyword.split(' ');
    for (const kw of keywordWords) {
      if (kw.length > 2 && inputWords.includes(kw)) {
        score += 5;
        if (!matchedKeywords.includes(kw)) {
          matchedKeywords.push(kw);
        }
      }
    }
  }

  return {
    intent,
    score,
    matchedKeywords,
  };
};

/**
 * Resolve the best matching intent for a user message
 * Returns the matched ChatIntent or FALLBACK_INTENT if score is below threshold
 */
export const findMatchingIntent = (userMessage: string): ChatIntent => {
  const normalizedInput = normalizeText(userMessage);

  if (!normalizedInput) {
    return FALLBACK_INTENT;
  }

  let bestMatch: MatchResult = {
    intent: FALLBACK_INTENT,
    score: 0,
    matchedKeywords: [],
  };

  for (const intent of CHAT_INTENTS) {
    const result = scoreIntent(normalizedInput, intent);
    if (result.score > bestMatch.score) {
      bestMatch = result;
    }
  }

  // Minimum confidence threshold
  const CONFIDENCE_THRESHOLD = 5;

  if (bestMatch.score >= CONFIDENCE_THRESHOLD) {
    return bestMatch.intent;
  }

  return FALLBACK_INTENT;
};
