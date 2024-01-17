import Fraction from 'fraction.js';
import { joinTokens } from '../distance';
import { Token, TokenName, TokenNormalisation } from '../interfaces';
import {
  isCurrencyExpression,
  isPercentExpression,
  symbolExpressionToCurrencySign,
} from './symbol';

class EnglishNumberNormalizer {
  zeros: { [key: string]: number } = {
    o: 0,
    oh: 0,
    zero: 0,
  };
  ones: { [key: string]: number } = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    eleven: 11,
    twelve: 12,
    thirteen: 13,
    fourteen: 14,
    fifteen: 15,
    sixteen: 16,
    seventeen: 17,
    eighteen: 18,
    nineteen: 19,
  };
  ones_plural: { [key: string]: [number, string] } = {
    ones: [1, 's'],
    twos: [2, 's'],
    threes: [3, 's'],
    fours: [4, 's'],
    fives: [5, 's'],
    sixes: [6, 's'],
    sevens: [7, 's'],
    eights: [8, 's'],
    nines: [9, 's'],
    tens: [10, 's'],
    elevens: [11, 's'],
    twelves: [12, 's'],
    thirteens: [13, 's'],
    fourteens: [14, 's'],
    fifteens: [15, 's'],
    sixteens: [16, 's'],
    seventeens: [17, 's'],
    eighteens: [18, 's'],
    nineteens: [19, 's'],
  };
  ones_ordinal: { [key: string]: [number, string] } = {
    zeroth: [0, 'th'],
    first: [1, 'st'],
    second: [2, 'nd'],
    third: [3, 'rd'],
    fourth: [4, 'th'],
    fifth: [5, 'th'],
    sixth: [6, 'th'],
    seventh: [7, 'th'],
    eigth: [8, 't'],
    nineth: [9, 'th'],
    tenth: [10, 'th'],
    eleventh: [11, 'th'],
    twelfth: [12, 'th'],
    thirteenth: [13, 'th'],
    fourteenth: [14, 'th'],
    fifteenth: [15, 'th'],
    sixteenth: [16, 'th'],
    seventeenth: [17, 'th'],
    eighteenth: [18, 'th'],
    nineteenth: [19, 'th'],
  };
  ones_suffixed: { [key: string]: [number, string] } = {
    ...this.ones_plural,
    ...this.ones_ordinal,
  };

  tens: { [key: string]: number } = {
    twenty: 20,
    thirty: 30,
    forty: 40,
    fifty: 50,
    sixty: 60,
    seventy: 70,
    eighty: 80,
    ninety: 90,
  };
  tens_plural: { [key: string]: [number, string] } = {
    twenties: [20, 's'],
    thirties: [30, 's'],
    forties: [40, 's'],
    fifties: [50, 's'],
    sixties: [60, 's'],
    seventies: [70, 's'],
    eighties: [80, 's'],
    nineties: [90, 's'],
  };
  tens_ordinal: { [key: string]: [number, string] } = {
    twentieth: [20, 'th'],
    thirtieth: [30, 'th'],
    fortieth: [40, 'th'],
    fiftieth: [50, 'th'],
    sixtieth: [60, 'th'],
    seventieth: [70, 'th'],
    eightieth: [80, 'th'],
    ninetieth: [90, 'th'],
  };
  tens_suffixed = { ...this.tens_plural, ...this.tens_ordinal };

  multipliers: { [key: string]: number } = {
    hundred: 100,
    thousand: 1000,
    million: 1000000,
    billion: 1000000000,
    trillion: 1000000000000,
    quadrillion: 1000000000000000,
  };
  multipliers_plural: { [key: string]: [number, string] } = {
    hundreds: [100, 's'],
    thousands: [1000, 's'],
    millions: [1000000, 's'],
    billions: [1000000000, 's'],
    trillions: [1000000000000, 's'],
    quadrillions: [1000000000000000, 's'],
  };
  multipliers_ordinal: { [key: string]: [number, string] } = {
    hundredth: [100, 'th'],
    thousandth: [1000, 'th'],
    millionth: [1000000, 'th'],
    billionth: [1000000000, 'th'],
    trillionth: [1000000000000, 'th'],
    quadrillionth: [1000000000000000, 'th'],
  };
  multipliers_suffixed = {
    ...this.multipliers_plural,
    ...this.multipliers_ordinal,
  };

  decimals = { ...this.ones, ...this.tens, ...this.zeros };

  preceding_prefixers: { [key: string]: string } = {
    minus: '-',
    negative: '-',
    plus: '+',
    positive: '+',
  };
  // following_prefixers: { [key: string]: string } = {
  //   pound: '£',
  //   pounds: '£',
  //   euro: '€',
  //   euros: '€',
  //   dollar: '$',
  //   dollars: '$',
  //   cent: '¢',
  //   cents: '¢',
  // };
  prefixes = [
    ...Object.values(this.preceding_prefixers),
    // ...Object.values(this.following_prefixers),
  ];
  // suffixers: { [key: string]: string | { [key: string]: string } } = {
  //   per: { cent: '%' },
  //   percent: '%',
  // };
  specials: string[] = ['and', 'double', 'triple', 'point'];

  words = new Set([
    ...Object.keys(this.zeros),
    ...Object.keys(this.ones),
    ...Object.keys(this.ones_suffixed),
    ...Object.keys(this.tens),
    ...Object.keys(this.tens_suffixed),
    ...Object.keys(this.multipliers),
    ...Object.keys(this.multipliers_suffixed),
    ...Object.keys(this.preceding_prefixers),
    // ...Object.keys(this.following_prefixers),
    // ...Object.keys(this.suffixers),
    ...Object.values(this.specials),
  ]);
  literal_words: string[] = ['one', 'ones'];

  preprocessTokens(tokens: Token[]): Token[] {
    const result: Token[] = [];
    for (let i = 0; i < tokens.length; i++) {
      const curr = tokens[i];

      // split compound words: nineteen-ninety
      if (curr.value.includes('-')) {
        const parts = curr.value.split('-');
        if (parts.some((o) => this.words.has(o.toLowerCase()))) {
          for (let i = 0; i < parts.length; i++) {
            const rawValue = parts[i];
            const value = rawValue.toLowerCase();
            const isNumber = this.words.has(value);
            const token: Token = {
              name: isNumber ? TokenName.NUMBER : TokenName.WORD,
              value: isNumber ? value : rawValue,
              rawValue,
              before: i === 0 ? curr.before : '',
              after: i < parts.length - 1 ? '-' : '',
              normalisations: [...curr.normalisations],
            };
            if (i === parts.length - 1) {
              token.after += curr.after;
            }
            result.push(token);
          }
          continue;
        }
      }

      // replace "<number> and a half" with "<number> point five"
      if (i > 0 && i < tokens.length - 2 && curr.value === 'and') {
        const prev = tokens[i - 1];
        const next1 = tokens[i + 1];
        const next2 = tokens[i + 2];
        if (
          (Object.hasOwn(this.decimals, prev.value) ||
            Object.hasOwn(this.multipliers, prev.value)) &&
          next1.value === 'a' &&
          next2.value === 'half'
        ) {
          const newTokens: Token[] = [
            {
              ...joinTokens([curr, next1]),
              value: 'point',
            },
            {
              ...next2,
              value: 'five',
            },
          ];
          newTokens.map((o) =>
            o.normalisations.push(TokenNormalisation.NUMBER)
          );
          result.push(...newTokens);

          i += 2;
          continue;
        }
      }

      // join tokens <number> <suffix>
      if (curr.name === TokenName.NUMBER && i < tokens.length - 1) {
        const next = tokens[i + 1];
        if (['st', 'nd', 'rd', 'th', 's'].includes(next.value)) {
          const token = joinTokens([curr, next]);
          token.normalisations.push(TokenNormalisation.NUMBER);
          token.value = token.value.replace(/\s/, '');
          result.push(token);
          i += 1;
          continue;
        }
      }

      result.push(curr);
    }

    return result;
  }

  postprocessTokens(tokens: Token[]): Token[] {
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
        if (
          isCurrencyExpression(curr.value) &&
          next.name === TokenName.NUMBER
        ) {
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
  }

  *processTokens(tokens: Token[]): Iterator<Token> {
    let prefix: string | null;
    let value: string | number | null = null;
    let mergedTokens: Token[] = [];

    let skip = false;

    if (tokens.length === 0) {
      return;
    }

    let current: Token;

    const output = (result: string | number) => {
      result = result.toString();
      if (prefix) {
        result = prefix + result;
      }

      const token = joinTokens(mergedTokens);
      token.name = TokenName.NUMBER;
      if (token.value !== result) {
        token.value = result;
        token.normalisations.push(TokenNormalisation.NUMBER);
      }

      value = null;
      prefix = null;
      mergedTokens = [];

      return token;
    };

    for (let i = 0; i < tokens.length; i++) {
      if (skip) {
        skip = false;
        continue;
      }

      let prev = i > 0 ? tokens[i - 1] : null;
      prev = prev?.name === TokenName.PUNCTUATION ? null : prev;

      current = tokens[i];
      const currentValue = current.value.toLowerCase();

      let next = i < tokens.length - 1 ? tokens[i + 1] : null;
      next = next?.name === TokenName.PUNCTUATION ? null : next;

      if (![TokenName.WORD, TokenName.NUMBER].includes(current.name)) {
        if (value !== null) {
          yield output(value);
        }
        yield current;
        continue;
      }

      const nextIsNumeric = next && !!next.value.match(/^\d+(\.\d+)?$/);
      const hasPrefix = this.prefixes.includes(currentValue[0]);
      const currentWithoutPrefix = hasPrefix
        ? currentValue.slice(1)
        : currentValue;

      if (currentWithoutPrefix.match(/^[0-9]$/)) {
        // integers
        if (value !== null) {
          if (typeof value === 'string' && value.endsWith('.')) {
            // concatenate decimals / ip address components
            mergedTokens.push(current);
            value = value.toString() + currentValue.toString();
            continue;
          } else if (value.toString().endsWith('0')) {
            mergedTokens.push(current);
            value = value.toString().slice(0, -1) + currentValue;
            yield output(value);
            continue;
          }
        }

        mergedTokens.push(current);
        if (hasPrefix) {
          prefix = currentValue[0];
        }
        value = currentWithoutPrefix;
      } else if (currentWithoutPrefix.match(/^\d+(\.\d+)?$/)) {
        // arabic numbers (potentially with signs and fractions)
        const f = new Fraction(currentWithoutPrefix);
        if (value !== null) {
          if (typeof value === 'string' && value.endsWith('.')) {
            // concatenate decimals / ip address components
            mergedTokens.push(current);
            value = value.toString() + currentValue.toString();
            continue;
          } else {
            yield output(value);
          }
        }

        mergedTokens.push(current);

        if (hasPrefix) {
          prefix = currentValue[0];
        }

        if (f.d === 1) {
          value = f.n;
        } else {
          value = currentWithoutPrefix;
        }
      } else if (!this.words.has(currentValue)) {
        // non-numeric words
        if (value !== null) {
          yield output(value);
        }
        yield current;
      } else if (Object.hasOwn(this.zeros, currentValue)) {
        if (
          currentValue === 'oh' &&
          value === null &&
          (!next || (!nextIsNumeric && !this.words.has(next.value)))
        ) {
          yield current;
        } else {
          mergedTokens.push(current);
          value = value === null ? '0' : value + '0';
        }
      } else if (Object.hasOwn(this.ones, currentValue)) {
        mergedTokens.push(current);
        const ones = this.ones[currentValue];
        if (value === null) {
          value = ones;
        } else if (
          typeof value === 'string' ||
          (prev && Object.hasOwn(this.ones, prev.value))
        ) {
          if (prev && Object.hasOwn(this.tens, prev.value) && ones < 10) {
            // replace the last zero with the digit
            value = (value as string).slice(0, -1) + ones.toString();
          } else {
            value = value + ones.toString();
          }
        } else if (ones < 10) {
          if (value % 10 === 0) {
            value += ones;
          } else {
            value = value.toString() + ones.toString();
          }
        } else {
          // eleven to nineteen
          if (value % 100 === 0) {
            value += ones;
          } else {
            value = value.toString() + ones.toString();
          }
        }
      } else if (Object.hasOwn(this.ones_suffixed, currentValue)) {
        mergedTokens.push(current);
        // ordinal or cardinal; yield the number right away
        const [ones, suffix] = this.ones_suffixed[currentValue];
        if (value === null) {
          yield output(ones.toString() + suffix);
        } else if (
          typeof value === 'string' ||
          (prev && Object.hasOwn(this.ones, prev.value))
        ) {
          if (prev && Object.hasOwn(this.tens, prev.value) && ones < 10) {
            yield output(
              (value as string).slice(0, -1) + ones.toString() + suffix
            );
          } else {
            yield output(`${value}${ones}${suffix}`);
          }
        } else if (ones < 10) {
          if (value % 10 === 0) {
            yield output(`${value + ones}${suffix}`);
          } else {
            yield output(`${value}${ones}${suffix}`);
          }
        } else {
          // eleven to nineteen
          if (value % 100 === 0) {
            yield output(`${value + ones}${suffix}`);
          } else {
            yield output(`${value}${ones}${suffix}`);
          }
        }
        value = null;
      } else if (Object.hasOwn(this.tens, currentValue)) {
        mergedTokens.push(current);
        const tens = this.tens[currentValue];
        if (value === null) {
          value = tens;
        } else if (typeof value === 'string') {
          value = value.toString() + tens.toString();
        } else {
          if (value % 100 === 0) {
            value += tens;
          } else {
            value = value.toString() + tens.toString();
          }
        }
      } else if (Object.hasOwn(this.tens_suffixed, currentValue)) {
        mergedTokens.push(current);
        // ordinal or cardinal; yield the number right away
        const [tens, suffix] = this.tens_suffixed[currentValue];
        if (value === null) {
          yield output(tens.toString() + suffix);
        } else if (typeof value === 'string') {
          yield output(value.toString() + tens.toString() + suffix);
        } else {
          if (value % 100 === 0) {
            yield output((value + tens).toString() + suffix);
          } else {
            yield output(value.toString() + tens.toString() + suffix);
          }
        }
      } else if (Object.hasOwn(this.multipliers, currentValue)) {
        mergedTokens.push(current);
        const multiplier = this.multipliers[currentValue];
        if (value === null) {
          value = multiplier;
        } else if (typeof value === 'string' || value === 0) {
          const f: Fraction = new Fraction(value);

          const p = f !== null ? f.mul(multiplier) : null;
          if (f !== null && p!.d === 1) {
            value = p!.n;
          } else {
            yield output(value);
            value = multiplier;
          }
        } else {
          const before: number = Math.floor(value / 1000) * 1000;
          const residual: number = value % 1000;
          value = before + residual * multiplier;
        }
      } else if (Object.hasOwn(this.multipliers, currentValue)) {
        mergedTokens.push(current);
        const [multiplier, suffix] = this.multipliers_suffixed[currentValue];
        if (value === null) {
          yield output(multiplier.toString() + suffix);
        } else if (typeof value === 'string') {
          const f = new Fraction(value);
          const p = f !== null ? f.mul(multiplier) : null; // TODO correct null check
          if (f !== null && p!.d === 1) {
            yield output(p!.n.toString() + suffix);
          } else {
            yield output(value);
            yield output(multiplier.toString() + suffix);
          }
        } else {
          // int
          const before: number = Math.floor(value / 1000) * 1000;
          const residual: number = value % 1000;
          value = before + residual * multiplier;
          yield output(value.toString() + suffix);
        }
        value = null;
      } else if (Object.hasOwn(this.preceding_prefixers, currentValue)) {
        // apply prefix (positive, minus, etc.) if it precedes a number
        if (value !== null) {
          yield output(value);
        }

        if ((next && this.words.has(next.value)) || nextIsNumeric) {
          mergedTokens.push(current);
          prefix = this.preceding_prefixers[currentValue];
        } else {
          yield current;
        }
      }
      // else if (currentValue in this.following_prefixers) {
      //   // apply prefix (dollars, cents, etc.) only after a number
      //   if (value !== null) {
      //     prefix = this.following_prefixers[currentValue];
      //     yield output(value);
      //   } else {
      //     yield output(currentValue);
      //   }
      // }
      // else if (currentValue in this.suffixers) {
      //   // apply suffix symbols (percent -> '%')
      //   if (value !== null) {
      //     const suffix = this.suffixers[currentValue];
      //     if (!(typeof suffix === 'string')) {
      //       if (next && Object.keys(suffix).includes(next.value)) {
      //         yield output(value.toString() + suffix[next.value]);
      //         skip = true;
      //       } else {
      //         yield output(value);
      //         yield output(currentValue);
      //       }
      //     } else {
      //       yield output(value.toString() + suffix);
      //     }
      //   } else {
      //     yield output(currentValue);
      //   }
      // }
      else if (this.specials.includes(currentValue)) {
        if (next && !this.words.has(next.value) && !nextIsNumeric) {
          // apply special handling only if the next word can be numeric
          if (value !== null) {
            yield output(value);
            yield current;
          } else {
            yield current;
          }
        } else if (currentValue === 'and') {
          // ignore "and" after hundreds, thousands, etc.
          if (prev && !Object.hasOwn(this.multipliers, prev.value)) {
            if (value !== null) {
              yield output(value);
              mergedTokens.push(current);
            } else {
              yield current;
            }
          } else if (value === null) {
            yield current;
          }
        } else if (['double', 'triple'].includes(currentValue)) {
          if (
            next &&
            (Object.hasOwn(this.ones, next.value) ||
              Object.hasOwn(this.zeros, next.value))
          ) {
            mergedTokens.push(current);
            const repeats = currentValue === 'double' ? 2 : 3;
            const ones = this.ones[next.value] || 0;
            value = (value || '').toString() + ones.toString().repeat(repeats);
            skip = true;
          } else {
            if (value !== null) {
              yield output(value);
              mergedTokens.push(current);
            } else {
              yield current;
            }
          }
        } else if (currentValue === 'point') {
          if (
            (next && Object.hasOwn(this.decimals, next.value)) ||
            nextIsNumeric
          ) {
            if (value && value.toString().includes('.')) {
              yield output(value);
            }
            mergedTokens.push(current);
            value = (value || '').toString() + '.';
          } else {
            yield current;
          }
        } else {
          // should all have been covered at this point
          console.error(
            `Number normaliser - unexpected token: ${current.value}`
          );
          if (value !== null) {
            yield output(value);
          }
          yield output(current.value);
        }
      } else {
        //all should have been covered at this point
        console.error(`Number normaliser - unexpected token: ${current.value}`);
        if (value !== null) {
          yield output(value);
        }
        yield output(current.value);
      }
    }

    if (value !== null) {
      yield output(value);
    }
  }
}

export const normaliseNumbers = (tokens: Token[]): Token[] => {
  const normalizer = new EnglishNumberNormalizer();

  const preprocessedTokens = normalizer.preprocessTokens(tokens);

  const iterator = normalizer.processTokens(preprocessedTokens);
  const processedTokens: Token[] = [];

  let result = iterator.next();

  while (!result.done) {
    processedTokens.push(result.value);
    result = iterator.next();
  }

  const postprocessedTokens = normalizer.postprocessTokens(processedTokens);

  return postprocessedTokens;
};
