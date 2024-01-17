import { Token, TokenName } from '../../interfaces';
import { isNumeric, isNumericWord } from './number.utils';

const normiseCompoundWord = (token: Token): Token[] => {
  const parts = token.value.split('-');

  if (!parts.some((o) => isNumeric(o) || isNumericWord(o.toLowerCase()))) {
    return [token];
  }

  return parts.map((o, i) => {
    const value = parts[i];
    const rawValue = i < parts.length - 1 ? `${value}-` : value;
    const before = i === 0 ? token.before : '';
    const after = i === parts.length - 1 ? token.after : '';

    return {
      name: TokenName.WORD,
      value,
      rawValue,
      before,
      after,
      normalisations: [...token.normalisations],
    };
  });
};

export const preprocessNumbers = (tokens: Token[]): Token[] => {
  const result: Token[] = [];

  for (const token of tokens) {
    // split compound words: nineteen-ninety
    if (token.value.includes('-')) {
      result.push(...normiseCompoundWord(token));
      continue;
    }

    result.push(token);
  }

  return result;
};
