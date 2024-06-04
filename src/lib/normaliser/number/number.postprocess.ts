import { joinTokens } from '../../distance';
import { Token, TokenName } from '../../interfaces';
import {
  isCurrencyExpression,
  isPercentExpression,
  symbolExpressionToCurrencySign,
} from '../symbol';

export const postprocessNumbers = (tokens: Token[]): Token[] => {
  const result: Token[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const curr = tokens[i];

    // dollar 2 and cents 70
    if (i < tokens.length - 4) {
      const next1 = tokens[i + 1];
      const and = tokens[i + 2];
      const next3 = tokens[i + 3];
      const next4 = tokens[i + 4];

      if (and.value === 'and') {
        let ordered: Token[] = [];

        if (
          isCurrencyExpression(curr.value) &&
          next1.name === TokenName.NUMBER
        ) {
          // dollar 2 and cents 70
          if (next3.value === 'cents' && next4.name === TokenName.NUMBER) {
            ordered = [curr, next1, next3, next4];
          }
          // dollar 2 and 70 cents
          if (next3.name === TokenName.NUMBER && next4.value === 'cents') {
            ordered = [curr, next1, next4, next3];
          }
        } else if (
          curr.name === TokenName.NUMBER &&
          isCurrencyExpression(next1.value)
        ) {
          // 2 dollar and cents 70
          if (next3.value === 'cents' && next4.name === TokenName.NUMBER) {
            ordered = [next1, curr, next3, next4];
          }
          // 2 dollar and 70 cents
          if (next3.name === TokenName.NUMBER && next4.value === 'cents') {
            ordered = [next1, curr, next4, next3];
          }
        }

        if (ordered.length) {
          const token = joinTokens([curr, next1, and, next3, next4]);
          const currency = symbolExpressionToCurrencySign(ordered[0].value);
          const integers = symbolExpressionToCurrencySign(ordered[1].value);
          const decimals = symbolExpressionToCurrencySign(ordered[3].value);
          const value = `${integers}.${decimals}`;
          if (value.startsWith('0.')) {
            token.value = `¢${value.slice(2)}`;
          } else {
            token.value = `${currency}${value}`;
          }
          result.push(token);
          i += 4;
          continue;
        }
      }
    }

    // dollar 2
    if (i < tokens.length - 1) {
      const next = tokens[i + 1];
      let ordered: Token[] = [];
      if (isCurrencyExpression(curr.value) && next.name === TokenName.NUMBER) {
        // dollar 2
        ordered = [curr, next];
      } else if (
        curr.name === TokenName.NUMBER &&
        isCurrencyExpression(next.value)
      ) {
        // 2 dollars
        ordered = [next, curr];
      }

      if (ordered.length) {
        const token = joinTokens([curr, next]);
        const value = ordered[1].value;
        if (value.startsWith('0.')) {
          token.value = `¢${value.slice(2)}`;
        } else {
          const currency = symbolExpressionToCurrencySign(ordered[0].value);
          token.value = `${currency}${value}`;
        }
        result.push(token);
        i += 1;
        continue;
      }
    }

    // 100%
    if (i < tokens.length - 1) {
      const next = tokens[i + 1];
      if (curr.name === TokenName.NUMBER && isPercentExpression(next.value)) {
        const token = {
          ...joinTokens([curr, next]),
          value: `${curr.value}%`,
        };
        result.push(token);
        i += 1;
        continue;
      }
    }

    // Write out one/s for readability
    if (curr.value === '1' || curr.value === '1s') {
      curr.value = curr.value.replace('1', 'one');
    }

    result.push(curr);
  }

  return result;
};
