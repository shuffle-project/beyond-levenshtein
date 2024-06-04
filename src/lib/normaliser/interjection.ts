// List retrieved from: https://github.com/openai/whisper/blob/main/whisper/normalizers/english.py

import { Token, TokenName, TokenNormalisation } from '../interfaces';

export const INTERJECTIONS = ['hmm', 'mm', 'mhm', 'mmm', 'uh', 'um', 'mm-hm'];

const isInterjection = (value: string): boolean => {
  return INTERJECTIONS.includes(value.toLowerCase());
};

export const normalizeInterjections = (tokens: Token[]): Token[] => {
  const result: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i];
    const prev = result.length ? result[result.length - 1] : null;
    const next = i < tokens.length - 1 ? tokens[i + 1] : null;

    if (isInterjection(curr.value)) {
      if (prev) {
        prev.after += `${curr.before}${curr.value}${curr.after}`;
        prev.normalisations.push(TokenNormalisation.INTERJECTION);
      }

      if (next?.name === TokenName.PUNCTUATION) {
        if (prev) {
          prev.after += `${next.before}${next.value}${next.after}`;
          prev.normalisations.push(TokenNormalisation.INTERJECTION);
        }
        i++;
      }

      continue;
    }

    result.push(curr);
  }

  return result;
};
