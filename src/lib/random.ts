import { ABBREVIATIONS } from './normaliser/abbreviation';
import { CONTRACTIONS } from './normaliser/contraction';
import { ADDITIONAL_DIACRITICS } from './normaliser/diacritic';
import { INTERJECTIONS } from './normaliser/interjection';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');

const ALL_CONTRACTIONS = CONTRACTIONS.map(([pattern, value]) => {
  const short = pattern
    .toString()
    .split('/')
    .slice(1, -1)
    .join('')
    .replace(/[\^\$]/g, '');
  const long = value;
  return { short, long };
});

const ALL_ABBREVIATIONS = Object.entries(ABBREVIATIONS).map(
  ([value, pattern]) => {
    const short = pattern
      .toString()
      .split('/')
      .slice(1, -1)
      .join('')
      .replace(/[\^\$\?]/g, '');

    return {
      short,
      long: value,
    };
  }
);

export class RandomTranscriptionGenerator {
  generate(length: number, wer: number): { ref: string; hyp: string } {
    let ref: string = '';
    let hyp: string = '';

    for (let i = 0; i < length; i++) {
      const value = this.word();
      ref += ` ${value}`;
      if (Math.random() < wer) {
        hyp += ` ${this.word(
          Math.max(3, value.length - 2),
          Math.min(10, value.length + 2)
        )}`;
      } else {
        hyp += ` ${value}`;
      }

      if (Math.random() < 0.5) {
        const punct = this.punct();
        ref += punct;
        if (Math.random() < 0.9) {
          if (Math.random() < 0.5) {
            hyp += this.punct();
          } else {
            hyp += punct;
          }
        }
      }
    }

    return { ref: ref.trim(), hyp: hyp.trim() };
  }

  randomInt(min: number, max: number): number {
    return Math.floor(
      Math.random() * (Math.floor(max) - Math.ceil(min)) + Math.ceil(min)
    );
  }

  char(): string {
    return LETTERS[this.randomInt(0, LETTERS.length - 1)];
  }

  word(min: number = 3, max: number = 10): string {
    return Array.from({ length: this.randomInt(min, max) }, () =>
      this.char()
    ).join('');
  }

  punct(): string {
    const rand = Math.random();
    if (rand < 0.4) {
      return ',';
    } else if (rand < 0.7) {
      return '.';
    } else {
      return ['!', '?', ':', ';'][this.randomInt(0, 3)];
    }
  }

  number(): string {
    return '';
  }

  currency(): string {
    return '';
  }

  abbreviation(): { short: string; long: string } {
    const abbr =
      ALL_ABBREVIATIONS[this.randomInt(0, ALL_ABBREVIATIONS.length - 1)];
    return abbr;
  }

  annotation(): string {
    const rand = Math.random();
    if (rand < 0.25) {
      return `<${this.word()}>`;
    } else if (rand < 0.5) {
      return `(${this.word()})`;
    } else if (rand < 0.5) {
      return `[${this.word()}]`;
    } else {
      return `{${this.word()})}`;
    }
  }

  contraction(): { short: string; long: string } {
    let { short, long } =
      ALL_CONTRACTIONS[this.randomInt(0, ALL_CONTRACTIONS.length - 1)];
    if (Math.random() < 0.5) {
      short = this.capitalise(short);
      long = this.capitalise(long);
    }
    return { short, long };
  }

  diacritic(): { a: string; b: string } {
    const diacritics = Object.entries(ADDITIONAL_DIACRITICS);
    const diacritic = diacritics[this.randomInt(0, diacritics.length - 1)];
    return {
      a: diacritic[0],
      b: diacritic[1],
    };
  }

  interjection(): string {
    return INTERJECTIONS[this.randomInt(0, INTERJECTIONS.length - 1)];
  }

  spelling(): string {
    return '';
  }

  symbol(): string {
    return '';
  }

  compoundWord(value: string): { ref: string; hyp: string } {
    const words = new Array(this.randomInt(2, 4))
      .fill(null)
      .map((o) => this.word(3, 8));
    let ref = '';
    let hyp = '';
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (i === 0) {
        ref += word;
        hyp += word;
      }
      const spacer = [` `, '-', ''];
    }
    return { ref, hyp };
  }

  capitalise(value: string): string {
    return `${value[0].toUpperCase()}${value.substring(1)}`;
  }
}

const generator = new RandomTranscriptionGenerator();

console.log(generator.generate(10, 0.5));
