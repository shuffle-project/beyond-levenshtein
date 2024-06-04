import { Token, TokenNormalisation } from '../interfaces';

const PATTERN = /\s?(\[.+?\]|\(.+?\)|<.+?>|\{.+?\})\s?/g;

export const normalizeAnnotations = (tokens: Token[]): Token[] => {
  const result: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i];
    const prev = result.length ? result[result.length - 1] : null;
    const next = i < tokens.length - 1 ? tokens[i + 1] : null;

    const matches = curr.value.match(PATTERN);
    if (matches) {
      let value = curr.value;
      for (const match of matches) {
        value = value.replace(match, '');
      }
      if (value === '') {
        if (prev) {
          prev.rawValue = `${prev.rawValue} ${curr.value}`;
          prev.normalisations.push(TokenNormalisation.ANNOTATION);
        } else if (next) {
          next.rawValue = `${value} ${curr.rawValue}`;
          next.normalisations.push(TokenNormalisation.ANNOTATION);
        }
        continue;
      } else {
        curr.value = value;
      }
    }

    result.push(curr);
  }

  return result;
};
