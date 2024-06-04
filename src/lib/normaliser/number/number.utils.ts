import {
  ALL_WORDS,
  PREFIXES,
  SPECIALS,
  WORDS,
  WORDS_SUFFIXED,
} from './number.constants';

export const isNumeric = (value: string): boolean => {
  return !!value.match(/^\d+(\.\d+)?$/);
};

export const isNumericWord = (value: string): boolean => {
  return Object.keys(WORDS).includes(value);
};

export const wordCouldBePartOfNumber = (value: string): boolean => {
  return ALL_WORDS.includes(value);
};

export const isPrefix = (value: string): boolean => {
  return Object.keys(PREFIXES).includes(value);
};

export const isSpecial = (value: string): boolean => {
  return SPECIALS.includes(value);
};

export const isInteger = (value: string): boolean => {
  return !!value.match(/^\d+$/);
};

export const isFloat = (value: string): boolean => {
  return !!value.match(/^\d+\.\d+$/);
};

export const isSuffixed = (value: string): boolean => {
  return Object.keys(WORDS_SUFFIXED).includes(value);
};
