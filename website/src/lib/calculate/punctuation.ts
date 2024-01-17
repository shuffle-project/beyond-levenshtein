import { Operation, Punctuation, Route, TokenName } from '../interfaces';

type PunctuationType =
  | 'period'
  | 'comma'
  | 'questionMark'
  | 'exclamationMark'
  | 'colon'
  | 'semicolon';

const PUNCTUATION_TYPES: { [key: string]: PunctuationType } = {
  '.': 'period',
  ',': 'comma',
  '?': 'questionMark',
  '!': 'exclamationMark',
  ':': 'colon',
  ';': 'semicolon',
};

export const summarisePunctuation = (route: Route): Punctuation => {
  const result: Punctuation = {
    ok: 0,
    ins: 0,
    del: 0,
    sub: 0,
    meta: {
      period: { ok: 0, ins: 0, del: 0, sub: 0 },
      comma: { ok: 0, ins: 0, del: 0, sub: 0 },
      questionMark: { ok: 0, ins: 0, del: 0, sub: 0 },
      exclamationMark: { ok: 0, ins: 0, del: 0, sub: 0 },
      colon: { ok: 0, ins: 0, del: 0, sub: 0 },
      semicolon: { ok: 0, ins: 0, del: 0, sub: 0 },
    },
  };

  for (const element of route) {
    switch (element.op) {
      case Operation.OK: {
        if (element.ref.name === TokenName.PUNCTUATION) {
          result.ok++;
          const type = PUNCTUATION_TYPES[element.ref.value] || null;
          if (type) {
            result.meta[type].ok++;
          }
        }
        break;
      }
      case Operation.DEL: {
        if (element.ref.name === TokenName.PUNCTUATION) {
          result.del++;
          const type = PUNCTUATION_TYPES[element.ref.value] || null;
          if (type) {
            result.meta[type].del++;
          }
        }
        break;
      }
      case Operation.INS: {
        if (element.hyp.name === TokenName.PUNCTUATION) {
          result.ins++;
          const type = PUNCTUATION_TYPES[element.hyp.value] || null;
          if (type) {
            result.meta[type].ins++;
          }
        }
        break;
      }
      case Operation.SUB:
        if (element.ref.name === TokenName.PUNCTUATION) {
          result.sub++;
          const type = PUNCTUATION_TYPES[element.ref.value] || null;
          if (type) {
            result.meta[type].sub++;
          }
        }
        break;
      default:
        break;
    }
  }

  return result;
};
