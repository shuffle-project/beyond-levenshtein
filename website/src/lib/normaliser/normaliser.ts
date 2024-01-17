import { Options, Token, TokenName, TokenNormalisation } from '../interfaces';
import { normalizeAbbreviation } from './abbreviation';
import { normalizeAnnotations } from './annotation';
import { normalizeContraction } from './contraction';
import { normalizeDiacritics } from './diacritic';
import { normalizeInterjections } from './interjection';
import { normaliseNumbers } from './numbers';
import { normalizeSpelling } from './spelling';
import { isSymbolExpression, normalizeSymbol } from './symbol';

const normalizeToken = (token: Token, options: Options): Token[] => {
  // Lowercase
  if (options.lowercase) {
    const value = token.value.toLowerCase();
    if (value !== token.value) {
      token.value = value;
      token.normalisations.push(TokenNormalisation.LOWERCASE);
    }
  }

  // Diacritics
  if (options.diacritics) {
    const value = normalizeDiacritics(token.value);
    if (value !== token.value) {
      token.value = value;
      token.normalisations.push(TokenNormalisation.DIACRITIC);
    }
  }

  switch (token.name) {
    case TokenName.PUNCTUATION:
      return [token];
    case TokenName.SYMBOL: {
      if (options.symbols) {
        const value = normalizeSymbol(token.value);
        if (value !== token.value) {
          token.value = value;
          token.normalisations.push(TokenNormalisation.SYMBOL);
        }
        return [token];
      }
      break;
    }
    case TokenName.WORD: {
      if (options.symbols && isSymbolExpression(token.value)) {
        token.name = TokenName.SYMBOL;
        const value = token.value.toLowerCase();
        if (value !== token.value) {
          token.value = value;
          token.normalisations.push(TokenNormalisation.SYMBOL);
        }
        return [token];
      }

      if (options.spelling) {
        const spelling = normalizeSpelling(token.value);
        if (spelling !== token.value) {
          token.value = spelling;
          token.normalisations.push(TokenNormalisation.SPELLING);
        }
      }

      if (options.contractions) {
        const contraction = normalizeContraction(token.value);
        if (contraction !== token.value) {
          const parts = contraction.split(' ');
          return parts.map((value, i) => {
            const normalisations = [
              ...token.normalisations,
              TokenNormalisation.CONTRACTION,
            ];
            return {
              ...token,
              value,
              normalisations,
              before: i === 0 ? token.before : ' ',
              after: i === parts.length - 1 ? token.after : '',
            };
          });
        }
      }

      if (options.abbreviations) {
        const abbreviation = normalizeAbbreviation(token.value);
        if (abbreviation !== token.value) {
          const parts = abbreviation.split(' ');
          return parts.map((value, i) => {
            const normalisations = [
              ...token.normalisations,
              TokenNormalisation.ABBREVIATION,
            ];
            return {
              ...token,
              value,
              normalisations,
              before: i === 0 ? token.before : ' ',
              after: i === parts.length - 1 ? token.after : '',
            };
          });
        }
      }

      return [token];
    }
    default:
      return [token];
  }

  return [token];
};

export const normalizeTokens = (tokens: Token[], options: Options): Token[] => {
  let result: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Eventually skip punctuation
    if (options.removePunctuation && token.name === TokenName.PUNCTUATION) {
      const prev = i > 0 ? tokens[i - 1] : null;
      const next = i < tokens.length - 1 ? tokens[i + 1] : null;
      if (token.before && prev) {
        prev.after += token.before;
      }
      if (token.after && next) {
        next.before += token.after;
      }
      continue;
    }

    result.push(...normalizeToken(token, options));
  }

  if (options.annotations) {
    result = normalizeAnnotations(result);
  }

  if (options.interjections) {
    result = normalizeInterjections(result);
  }

  if (options.numbers) {
    result = normaliseNumbers(result);
  }

  // Remove duplicate normalisations per token
  for (const token of result) {
    if (token.normalisations.length) {
      token.normalisations = [...new Set(token.normalisations)];
    }
  }

  return result;
};
