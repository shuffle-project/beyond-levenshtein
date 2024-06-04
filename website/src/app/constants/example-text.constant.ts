export const EXAMPLE_HYPOTHESIS = [
  `This an advanced error rate computation algorithm.`,
  `\nClassification:`,
  `It provides a granular error classification like punctuation. or Capitalisation.`,
  `Compound words like icecream, every thing or state of the art are detected.`,
  `Word substitutions are further classified into the categories: stemmer, fixes, suffi, fix, homofones`,
  `\nNormalisations:`,
  `Spelling differences between US and UK English are automatically normalised.`,
  `Common contractions like won't, I'm or Mr. are converted to their long form.`,
  `Common abbreviations like et cetera, versus or Boulevard will be converted to their long form.`,
  `Symbols like €, $, Percent are compared by their written form. Except for symbol number combinations: 100% or $100.`,
  `Diacritics like Ä or ß are unified.`,
  `Numbers and numerical expressions are unified to numbers: first, 2nd, eleven, nineteen ninety nine`,
].join('\n');

export const EXAMPLE_GROUND_TRUTH = [
  `This is an ehanced error rate computation.`,
  `\nClassification:`,
  `It provides a granular error classification like punctuation or capitalisation.`,
  `Compound words like ice cream, everything or state-of-the-art are detected.`,
  `Word substitutions are further classified into the categories: stemmers, prefixes, suffixes, affixes, homophones`,
  `\nNormalisations:`,
  `Spelling differences between US and UK English are automatically normalized.`,
  `Common contractions like will not, I am or Mister are converted to their long form.`,
  `Common abbreviations like etc., vs. or Blvd. will be converted to their long form.`,
  `Symbols like Euro, dollar, % are compared by their written form. Except for symbol number combinations: 100 percent or 100 dollar.`,
  `Diacritics like Ae or ss are unified.`,
  `Numbers and numerical expressions are unified to numbers: 1st, second, 11, 1999`,
].join('\n');
