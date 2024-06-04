import { Options, Token, TokenName, TokenNormalisation } from './interfaces';
import {
  isAbbreviation,
  isGenericAbbreviation,
  isGenericAbbreviationSegment,
} from './normaliser/abbreviation';
import { normalizeTokens } from './normaliser/normaliser';
import { isSymbolCharacter } from './normaliser/symbol';
import { createOptions } from './options';

class Lexer {
  private numerals = '1234567890'.split('');
  private characters: string[] = [];
  private tokens: Token[] = [];
  private index = 0;

  private token!: Token;

  constructor() {}

  private peek(offset: number = 0): string {
    return this.characters[this.index + offset];
  }

  private consume(): string {
    const char = this.characters[this.index];
    this.index++;
    return char;
  }

  private isEOF(): boolean {
    return this.index === this.characters.length;
  }

  private isNumeral(value: string): boolean {
    return this.numerals.includes(value);
  }

  private isPunctuationCharacter(value: string): boolean {
    return ['?', '!', '.', ',', ';', ':'].includes(value);
  }

  private isSpacingCharacter(value: string): boolean {
    return ['\n', ' ', '\t'].includes(value);
  }

  private isNonWordCharacter(value: string): boolean {
    const c = value.normalize('NFKD').charCodeAt(0);

    if (c >= 768 && c <= 879) {
      return true;
    }

    // em-dash
    if (c === 8212) {
      return true;
    }

    return false;
  }

  private isEmptyToken(): boolean {
    return this.token.value === '';
  }

  private startNewToken(): void {
    if (this.token?.value) {
      this.tokens.push(this.token);
    }
    this.token = {
      name: TokenName.WORD,
      value: '',
      rawValue: '',
      before: '',
      after: '',
      normalisations: [],
    };
  }

  parse(content: string): Token[] {
    this.index = 0;
    this.characters = content.split('');
    this.tokens = [];

    this.startNewToken();

    while (true) {
      if (this.isEOF()) {
        this.startNewToken();
        break;
      }

      const char = this.consume();

      // Newlines, tabs, spaces
      if (this.isSpacingCharacter(char) || this.isNonWordCharacter(char)) {
        if (this.isEmptyToken()) {
          this.token.before += char;
        } else {
          this.token.after += char;
        }
        continue;
      }

      // Symbols
      if (isSymbolCharacter(char)) {
        this.startNewToken();
        this.token.name = TokenName.SYMBOL;
        this.token.value += char;
        this.token.rawValue += char;
        continue;
      }

      // Characters inside a number
      if ([',', '.', '_'].includes(char) && this.isNumeral(this.peek())) {
        if (char === '_') {
          if (this.token.name === TokenName.NUMBER) {
            this.token.rawValue += char;
            this.token.normalisations.push(TokenNormalisation.NUMBER);
            continue;
          }
        } else if (char === ',') {
          if (
            this.token.name === TokenName.NUMBER &&
            !this.token.rawValue.includes(',')
          ) {
            this.token.rawValue += char;
            this.token.normalisations.push(TokenNormalisation.NUMBER);
            continue;
          }
        } else {
          if (
            this.isEmptyToken() ||
            (this.token.name === TokenName.NUMBER &&
              !this.token.value.includes('.'))
          ) {
            this.token.name == TokenName.NUMBER;
            this.token.value += char;
            this.token.rawValue += char;
            continue;
          }
        }
      }

      if (char === '.') {
        // Contraction or abbreviation
        const value = `${this.token.value}.`;
        if (isAbbreviation(value)) {
          this.token.value += char;
          this.token.rawValue += char;
          continue;
        }

        // Generic abbreviation (e.g. D.N.A.)
        if (isGenericAbbreviationSegment(value)) {
          const next = `${this.peek()}${this.peek(1)}`;
          if (isGenericAbbreviationSegment(next)) {
            this.token.value += char;
            this.token.rawValue += char;
            continue;
          } else if (isGenericAbbreviation(value)) {
            this.token.value += char;
            this.token.rawValue += char;
            this.token.value = this.token.value
              .replace(/\./g, '')
              .toUpperCase();
            this.token.normalisations.push(TokenNormalisation.ABBREVIATION);
            this.startNewToken();
            continue;
          }
        }

        // ...
        if (
          this.token.value === '.' &&
          this.peek() === '.' &&
          this.peek(1) !== '.'
        ) {
          this.token.value += '..';
          this.token.rawValue += '..';
          this.consume();
          continue;
        }
      }

      // Punctuation characters start a new token
      if (this.isPunctuationCharacter(char)) {
        this.startNewToken();
        this.token.name = TokenName.PUNCTUATION;
        this.token.value += char;
        this.token.rawValue += char;
        continue;
      }

      // Leading or preceding quotation chars
      if ([`'`, `"`, `“`, `”`].includes(char)) {
        if (this.token.value === '') {
          this.token.before += char;
          continue;
        } else if (
          this.token.after ||
          this.isSpacingCharacter(this.peek()) ||
          this.isPunctuationCharacter(this.peek())
        ) {
          this.token.after += char;
          continue;
        }
      }

      // Start new token after punctuation, formatting character or symbol
      if (
        this.token.name === TokenName.PUNCTUATION ||
        this.token.name === TokenName.SYMBOL ||
        this.token.after !== ''
      ) {
        this.startNewToken();
      }

      // Eventually define token as number
      if (this.isEmptyToken() && this.isNumeral(char)) {
        this.token.name = TokenName.NUMBER;
      }

      // Append char
      this.token.value += char;
      this.token.rawValue += char;
    }

    return this.tokens;
  }
}

export const parse = (text: string, options?: Options): Token[] => {
  const opt = createOptions(options);

  const tokens = new Lexer().parse(text);

  return normalizeTokens(tokens, opt);
};
