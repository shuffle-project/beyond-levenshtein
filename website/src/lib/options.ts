import { Options } from './interfaces';

export const DEFAULT_OPTIONS: Options = {
  abbreviations: true,
  annotations: true,
  compoundWords: true,
  contractions: true,
  diacritics: true,
  interjections: true,
  numbers: true,
  spelling: true,
  symbols: true,
  lowercase: false,
  removePunctuation: false,
};

export const createOptions = (options?: Options): Options => {
  return { ...DEFAULT_OPTIONS, ...(options || {}) };
};
