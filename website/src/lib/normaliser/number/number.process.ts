import { joinTokens } from '../../distance';
import { Token, TokenName, TokenNormalisation } from '../../interfaces';
import {
  MULTIPLIERS,
  MULTIPLIERS_SUFFIXED,
  ONES,
  ONES_SUFFIXED,
  PREFIXES,
  TENS,
  TENS_SUFFIXED,
  ZEROS,
} from './number.constants';
import {
  isFloat,
  isNumeric,
  isNumericWord,
  isPrefix,
  isSpecial,
  isSuffixed,
  wordCouldBePartOfNumber,
} from './number.utils';

class CurrentNumber {
  private tokens: Token[] = [];

  private hasFloat() {
    return this.tokens.some(
      (o) => isFloat(o.value) || o.value.toLowerCase() === 'point'
    );
  }

  private hasSuffix(): boolean {
    return this.tokens.some((o) => isSuffixed(o.value));
  }

  addToken(token: Token) {
    this.tokens.push(token);
  }

  canAppendToken(token: Token): boolean {
    if (this.tokens.length === 0) {
      return true;
    }

    const value = token.value.toLowerCase();

    const prev = this.tokens[this.tokens.length - 1];

    if (isNumeric(token.value)) {
      if (isNumeric(prev.value)) {
        return false;
      }

      if (this.hasFloat()) {
        if (isFloat(token.value)) {
          return false;
        }
        if (isSuffixed(value)) {
          return false;
        }
      }
    }

    if (value === 'point') {
      if (this.hasFloat()) {
        return false;
      }
      return true;
    }

    if (isSuffixed(value) && this.hasSuffix()) {
      return false;
    }

    if (isNumericWord(value)) {
      return true;
      // if (Object.keys(ONES).includes(value)) {
      //   if (this.hasFloat()) {
      //     return true;
      //   }

      //   if (
      //     isNumeric(prev.value) &&
      //     prev.value[prev.value.length - 1] !== '0'
      //   ) {
      //   } else if (Object.keys(ONES).includes(prev.value.toLowerCase())) {
      //     return false;
      //   }
      // }
    }

    return true;
  }

  getMergedToken(): Token {
    let prefix = '';
    let integers = '';
    let decimalsStarted = false;
    let decimals = '';
    let suffix = '';

    const addZero = (zero: number) => {
      if (decimalsStarted) {
        decimals += zero;
      } else {
        integers += zero;
      }
    };

    const addOne = (one: number, prev: string | null) => {
      let append = false;
      let value = decimalsStarted ? decimals : integers;

      if (!prev || value === '') {
        append = true;
      } else if (
        Object.keys(ONES).includes(prev) ||
        Object.keys(ZEROS).includes(prev)
      ) {
        append = true;
      } else if (one < 10) {
        // 1 - 9
        if (
          Object.keys(TENS).includes(prev!) ||
          Object.keys(MULTIPLIERS).includes(prev!)
        ) {
          append = false;
        } else {
          append = true;
        }
      } else {
        // 10 - 19
        if (value.slice(-2) === '00') {
          append = false;
        } else {
          append = true;
        }
      }

      if (append) {
        value += one;
      } else {
        value = value.slice(0, one < 10 ? -1 : -2) + one;
      }

      if (decimalsStarted) {
        decimals = value;
      } else {
        integers = value;
      }
    };

    const addTen = (ten: number, prev: string | null) => {
      let append = false;
      let value = decimalsStarted ? decimals : integers;

      if (!prev || value === '') {
        append = true;
      } else if (
        Object.keys(TENS).includes(prev) ||
        Object.keys(ONES).includes(prev) ||
        Object.keys(ZEROS).includes(prev)
      ) {
        append = true;
      } else if (value.slice(-2) === '00') {
        append = false;
      } else {
        append = true;
      }

      if (append) {
        value += ten;
      } else {
        value = value.slice(0, -2) + ten;
      }

      if (decimalsStarted) {
        decimals = value;
      } else {
        integers = value;
      }
    };

    const multiply = (multiplier: number) => {
      // multiplier = self.multipliers[current]
      // if value is None:
      //     value = multiplier
      // elif isinstance(value, str) or value == 0:
      //     f = to_fraction(value)
      //     p = f * multiplier if f is not None else None
      //     if f is not None and p.denominator == 1:
      //         value = p.numerator
      //     else:
      //         yield output(value)
      //         value = multiplier
      // else:
      //     before = value // 1000 * 1000
      //     residual = value % 1000
      //     value = before + residual * multiplier

      if (!integers && !decimals) {
        if (decimalsStarted) {
          decimals += multiplier;
        } else {
          integers += multiplier;
        }
      } else if (decimalsStarted) {
        integers =
          integers +
          decimals +
          multiplier.toString().slice(decimals.length + 1);
        decimalsStarted = false;
        decimals = '';
      } else {
        integers += multiplier.toString().slice(1);
      }
    };

    const values = this.tokens.map((o) => o.value.toLowerCase());
    for (let i = 0; i < values.length; i++) {
      const value = values[i];
      const prev = i > 0 ? values[i - 1] : null;
      if (isNumeric(value)) {
        if (isFloat(value)) {
          if (decimalsStarted) {
            throw new Error('should never happen');
          }
          [integers, decimals] = value.split('.');
          decimalsStarted = true;
        } else {
          if (decimalsStarted) {
            decimals += value;
          } else {
            integers += value;
          }
        }
        continue;
      }

      if (isPrefix(value)) {
        prefix = PREFIXES[value];
        continue;
      }

      if (isSpecial(value)) {
        switch (value) {
          case 'and': {
            continue;
          }
          case 'point': {
            decimalsStarted = true;
            continue;
          }
          case 'double':
          case 'triple': {
            if (values.length === i - 1) {
              throw Error('Should never happen');
            }
            const next = values[i + 1];
            const insert = value === 'double' ? [next] : [next, next];
            values.splice(i + 1, 0, ...insert);
            continue;
          }
        }
      }

      if (isSuffixed(value)) {
        if (Object.keys(ONES_SUFFIXED).includes(value)) {
          const one = ONES_SUFFIXED[value];
          suffix = one[1];
          addOne(one[0], prev);
          continue;
        }

        if (Object.keys(TENS_SUFFIXED).includes(value)) {
          const ten = TENS_SUFFIXED[value];
          suffix = ten[1];
          addTen(ten[0], prev);
          continue;
        }

        if (Object.keys(MULTIPLIERS_SUFFIXED).includes(value)) {
          const multiplier = MULTIPLIERS_SUFFIXED[value];
          suffix = multiplier[1];
          multiply(multiplier[0]);
          continue;
        }

        throw new Error('what');
      }

      if (Object.keys(ZEROS).includes(value)) {
        addZero(0);
        continue;
      }

      if (Object.keys(ONES).includes(value)) {
        addOne(ONES[value], prev);
        continue;
      }

      if (Object.keys(TENS).includes(value)) {
        addTen(TENS[value], prev);
        continue;
      }

      if (Object.keys(MULTIPLIERS).includes(value)) {
        multiply(MULTIPLIERS[value]);
        continue;
      }
    }

    let numberValue = `${prefix}${integers}${suffix}`;
    if (decimalsStarted) {
      numberValue += `.${decimals}`;
    }

    const token = joinTokens(this.tokens);
    if (token.value !== numberValue) {
      token.value = numberValue;
      token.normalisations.push(TokenNormalisation.NUMBER);
    }
    token.name = TokenName.NUMBER;

    return token;
  }
}

class NumberProcessor {
  private current!: CurrentNumber | null;

  constructor(private tokens: Token[]) {}

  private getToken = (index: number): Token | null => {
    return index < 0 || index > this.tokens.length - 1
      ? null
      : this.tokens[index];
  };

  process() {
    const processed: Token[] = [];

    for (let i = 0; i < this.tokens.length; i++) {
      const prev = this.getToken(i - 1);
      const curr = this.tokens[i];
      const next = this.getToken(i + 1);

      // isNumeric
      if (isNumeric(curr.value)) {
        // Start new number
        if (!this.current) {
          this.current = new CurrentNumber();
          this.current.addToken(curr);
          continue;
        }

        // Append to current number
        if (this.current.canAppendToken(curr)) {
          this.current.addToken(curr);
          continue;
        }

        // Finish current number and start new number
        processed.push(this.current.getMergedToken());
        this.current = new CurrentNumber();
        this.current.addToken(curr);
        continue;
      }

      const value = curr.value.toLowerCase();

      // Cannot be part of number
      if (!wordCouldBePartOfNumber(value)) {
        // Finish current number
        if (this.current) {
          processed.push(this.current.getMergedToken());
          this.current = null;
        }

        // Append current token
        processed.push(curr);
        continue;
      }

      // Prefix
      if (isPrefix(value)) {
        // Finish number before prefix
        if (this.current) {
          processed.push(this.current.getMergedToken());
          this.current = null;
        }

        if (next) {
          // Next token is a number
          if (
            isNumeric(next.value) ||
            isNumericWord(next.value.toLowerCase())
          ) {
            this.current = new CurrentNumber();
            this.current.addToken(curr);
            this.current.addToken(next);
            i++;
            continue;
          }

          const afterNext = this.getToken(i + 2);
          if (
            next.value === 'point' &&
            afterNext &&
            (isNumeric(afterNext.value) ||
              isNumericWord(afterNext.value.toLowerCase()))
          ) {
            this.current = new CurrentNumber();
            this.current.addToken(curr);
            this.current.addToken(next);
            this.current.addToken(afterNext);
            i += 2;
            continue;
          }
        }

        // Prefix is not part of a number
        processed.push(curr);
        continue;
      }

      // Specials
      if (isSpecial(value)) {
        if (
          !next ||
          (!isNumeric(next.value.toLowerCase()) &&
            !isNumericWord(next.value.toLowerCase()))
        ) {
          if (this.current) {
            processed.push(this.current.getMergedToken());
            processed.push(curr);
            continue;
          }
        }

        switch (value) {
          case 'and': {
            if (this.current) {
              if (this.current.canAppendToken(curr)) {
                this.current.addToken(curr);
              } else {
                processed.push(this.current.getMergedToken());
                processed.push(curr);
                this.current = null;
              }
            } else {
              processed.push(curr);
            }
            break;
          }
          case 'point':
          case 'double':
          case 'triple': {
            if (this.current) {
              if (this.current.canAppendToken(curr)) {
                this.current.addToken(curr);
              } else {
                processed.push(this.current.getMergedToken());
                this.current = new CurrentNumber();
                this.current.addToken(curr);
              }
            } else {
              this.current = new CurrentNumber();
              this.current.addToken(curr);
            }
            break;
          }
        }
        continue;
      }

      // Others: numbers, multipliers, ordinals, plurals
      if (this.current) {
        if (this.current.canAppendToken(curr)) {
          this.current.addToken(curr);
          continue;
        } else {
          processed.push(this.current.getMergedToken());
          this.current = null;
        }
      }

      if (['o', 'oh'].includes(value)) {
        processed.push(curr);
        continue;
      }

      this.current = new CurrentNumber();
      this.current.addToken(curr);
    }

    // Finish open number
    if (this.current) {
      processed.push(this.current.getMergedToken());
      this.current = null;
    }

    return processed;
  }
}

export const processNumbers = (tokens: Token[]): Token[] => {
  const processor = new NumberProcessor(tokens);
  return processor.process();
};
