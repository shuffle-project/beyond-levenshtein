export enum TokenName {
  WORD = 'word',
  PUNCTUATION = 'punctuation',
  NUMBER = 'number',
  SYMBOL = 'symbol',
}

export enum SubstitutionName {
  WORD = 'word',
  PUNCTUATION = 'punctuation',
  CAPITALISATION = 'capitalisation',
  NUMBER = 'number',
  COMPOUND_WORD = 'compound_word',
  PREFIX = 'prefix',
  SUFFIX = 'suffix',
  AFFIX = 'affix',
  HOMOPHONE = 'homophone',
  STEMMER = 'stemmer',
}

export enum TokenNormalisation {
  ABBREVIATION = 'abbreviation',
  ANNOTATION = 'annotation',
  CONTRACTION = 'contraction',
  DIACRITIC = 'diacritic',
  INTERJECTION = 'interjection',
  LOWERCASE = 'lowercase',
  NUMBER = 'number',
  SPELLING = 'spelling',
  SYMBOL = 'symbol',
}

export interface Token {
  name: TokenName;
  value: string;
  rawValue: string;
  before: string;
  after: string;
  normalisations: TokenNormalisation[];
}

export enum Operation {
  OK = 0,
  SUB = 1,
  INS = 2,
  DEL = 3,
}

export enum DistanceOperation {
  OK = 0,
  SUB = 1,
  INS = 2,
  DEL = 3,
  CONCAT_HYP = 4,
  CONCAT_REF = 5,
  CONCAT_END = 6,
  ERROR = 7,
  NOOP = 8,
}

export interface RouteElementOK {
  op: Operation.OK;
  ref: Token;
  hyp: Token;
}

export interface RouteElementSub {
  op: Operation.SUB;
  ref: Token;
  hyp: Token;
  name: string;
}

export interface RouteElementDel {
  op: Operation.DEL;
  ref: Token;
}

export interface RouteElementIns {
  op: Operation.INS;
  hyp: Token;
}

export type RouteElement =
  | RouteElementOK
  | RouteElementSub
  | RouteElementDel
  | RouteElementIns;

export type Route = RouteElement[];

export interface Operations {
  ok: number;
  ins: number;
  del: number;
  sub: number;
}
export interface Words extends Operations {
  meta: {
    substitutions: {
      affixes: number;
      capitalisation: number;
      compoundWords: number;
      homophones: number;
      numbers: number;
      prefixes: number;
      stemmers: number;
      suffixes: number;
      unspecified: number;
    };
    capitalisation: Operations;
    numbers: Operations;
  };
}

export interface Punctuation extends Operations {
  meta: {
    period: Operations;
    comma: Operations;
    questionMark: Operations;
    exclamationMark: Operations;
    colon: Operations;
    semicolon: Operations;
  };
}

export type Normalisations = Record<TokenNormalisation, number>;

export interface Metrics {
  wer: number;
  mer: number;
  wil: number;
  ier: number;
  der: number;
  punctuation: {
    errorRate: number;
    f1Score: number;
  };
  capitalisation: {
    errorRate: number;
    f1Score: number;
  };
  numbers: {
    errorRate: number;
    f1Score: number;
  };
}
export interface Measures {
  metrics: Metrics;
  words: Words;
  punctuation: Punctuation;
  normalisations: Normalisations;
}

export interface Options {
  abbreviations?: boolean;
  annotations?: boolean;
  compoundWords?: boolean;
  contractions?: boolean;
  diacritics?: boolean;
  interjections?: boolean;
  numbers?: boolean;
  spelling?: boolean;
  symbols?: boolean;
  lowercase?: boolean;
  removePunctuation?: boolean;
}
