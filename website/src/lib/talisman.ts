// @ts-nocheck
import jw from 'talisman/metrics/jaro-winkler';
import doubleMetaphone from 'talisman/phonetics/double-metaphone';
import porter from 'talisman/stemmers/porter';

export const isHomophone = (a: string, b: string): boolean => {
  const aList = doubleMetaphone(a);
  const bList = doubleMetaphone(b);

  const result = aList.some((o) => bList.includes(o));

  return result;
};

export const getStemmer = (value: string): string => {
  return porter(value);
};

export const isStemmer = (a: string, b: string): boolean => {
  const result = porter(a) === porter(b);

  return result;
};

export const jaroWinkler = (a: string, b: string): number => {
  return jw.distance(a, b);
};
