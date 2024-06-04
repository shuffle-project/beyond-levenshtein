import {
  DistanceOperation,
  Operation,
  Options,
  Route,
  SubstitutionName,
  Token,
  TokenName,
} from './interfaces';
import { createOptions } from './options';
import { isHomophone, isStemmer } from './talisman';

const WEAK_PENALITY = 1;
const DEFAULT_PENALITY = 2;
const STRONG_PENALITY = 4;

const getDeletionPenalty = (r: Token): number => {
  switch (r.name) {
    case TokenName.PUNCTUATION:
      return WEAK_PENALITY;
    default:
      return DEFAULT_PENALITY;
  }
};

const getInsertionPenalty = (h: Token): number => {
  switch (h.name) {
    case TokenName.PUNCTUATION:
      return WEAK_PENALITY;
    default:
      return DEFAULT_PENALITY;
  }
};

const getSubstitutionPenalty = (r: Token, h: Token): number => {
  // Different types
  if (
    r.name !== h.name &&
    ([TokenName.NUMBER, TokenName.PUNCTUATION].includes(r.name) ||
      [TokenName.NUMBER, TokenName.PUNCTUATION].includes(h.name))
  ) {
    return STRONG_PENALITY;
  }

  // Punctuation
  if (r.name === TokenName.PUNCTUATION && h.name === TokenName.PUNCTUATION) {
    return WEAK_PENALITY;
  }

  // Capitalisation
  if (r.value.toLowerCase() === h.value.toLowerCase()) {
    return WEAK_PENALITY;
  }

  return DEFAULT_PENALITY;
};

const getCompoundWordSlice = (
  tokens: Token[],
  index: number,
  length: number
): { value: string; rawValue: string } | undefined => {
  const start = index;
  const end = index + length;
  if (start < 0 || end > tokens.length) {
    return;
  }
  const slice = tokens.slice(start, end);

  if (slice.some((o) => o.name === TokenName.PUNCTUATION)) {
    return;
  }

  const rawValue = slice.map((o) => o.value).join('');
  const value = rawValue.replace(/[\-\s]/g, '').toLowerCase();

  return {
    value,
    rawValue,
  };
};

const isCompoundWord = (
  r: Token[],
  h: Token[],
  rIndex: number,
  hIndex: number,
  rLength: number,
  hLength: number
): [number, number] => {
  const rPart = getCompoundWordSlice(r, rIndex, rLength);
  if (!rPart) {
    return [0, 0];
  }

  const hPart = getCompoundWordSlice(h, hIndex, hLength);
  if (!hPart) {
    return [0, 0];
  }

  if (rPart.value === hPart.value) {
    if (rLength === 1 && hLength === 1) {
      if (rPart.rawValue.length !== hPart.rawValue.length) {
        return [rLength, hLength];
      } else {
        return [0, 0];
      }
    } else {
      return [rLength, hLength];
    }
  } else if (rPart.value.startsWith(hPart.value)) {
    return isCompoundWord(r, h, rIndex, hIndex, rLength, hLength + 1);
  } else if (hPart.value.startsWith(rPart.value)) {
    return isCompoundWord(r, h, rIndex, hIndex, rLength + 1, hLength);
  } else {
    return [0, 0];
  }
};

export const joinTokens = (tokens: Token[]): Token => {
  const token: Token = {
    name: TokenName.WORD,
    value: '',
    rawValue: '',
    before: '',
    after: '',
    normalisations: [],
  };

  for (let i = 0; i < tokens.length; i++) {
    const { value, rawValue, before, after, normalisations } = tokens[i];
    token.normalisations.push(...normalisations);

    if (i === 0) {
      token.before = before;
    } else {
      token.value += before;
      token.rawValue += before;
    }

    token.value += value;
    token.rawValue += rawValue;

    if (i === tokens.length - 1) {
      token.after = after;
    } else {
      token.value += after;
      token.rawValue += after;
    }
  }

  return token;
};

const getSubstitutionName = (from: Token, to: Token): SubstitutionName => {
  if (from.name === TokenName.PUNCTUATION) {
    return SubstitutionName.PUNCTUATION;
  }

  if (from.name === TokenName.NUMBER) {
    return SubstitutionName.NUMBER;
  }

  if (from.name !== to.name) {
    return SubstitutionName.WORD;
  }

  const a = from.value.toLowerCase();
  const b = to.value.toLowerCase();
  if (a === b) {
    return SubstitutionName.CAPITALISATION;
  }

  if (isStemmer(from.value, to.value)) {
    return SubstitutionName.STEMMER;
  }

  if (a.endsWith(b)) {
    return SubstitutionName.PREFIX;
  }

  if (a.startsWith(b)) {
    return SubstitutionName.SUFFIX;
  }

  if (a.includes(b)) {
    return SubstitutionName.AFFIX;
  }

  if (isHomophone(from.value, to.value)) {
    return SubstitutionName.HOMOPHONE;
  }

  return SubstitutionName.WORD;
};

export const distance = (
  reference: Token[],
  hypothesis: Token[],
  options?: Options
): Route => {
  const opt = createOptions(options);

  const r = reference.slice();
  const h = hypothesis.slice();

  // Empty reference
  if (r.length === 0) {
    return h.map((hyp) => ({ op: Operation.INS, hyp }));
  }

  // Empty hypothesis
  if (h.length === 0) {
    return r.map((ref) => ({ op: Operation.DEL, ref }));
  }

  // Use smallest number array possible to optimise memory usage
  const UintXArray =
    Math.max(r.length, h.length) * DEFAULT_PENALITY > 65535
      ? Uint32Array
      : Uint16Array;

  // costs will holds the costs, like in the Levenshtein distance algorithm
  const costs = Array.from(
    { length: r.length + 1 },
    () => new UintXArray(h.length + 1)
  );

  // backtrace will hold the operations we've done so we could later backtrace, like the WER algorithm requires us to.
  const backtrace = Array.from({ length: r.length + 1 }, () =>
    new UintXArray(h.length + 1).fill(DistanceOperation.NOOP)
  );

  // First column represents the case where we achieve zero hypothesis words by deleting all reference words.
  for (let i = 1; i < r.length + 1; i++) {
    costs[i][0] = DEFAULT_PENALITY * i;
    backtrace[i][0] = DistanceOperation.DEL;
  }

  // First row represents the case where we achieve the hypothesis by inserting all hypothesis words into a zero-length reference.
  for (let i = 1; i < h.length + 1; i++) {
    costs[0][i] = DEFAULT_PENALITY * i;
    backtrace[0][i] = DistanceOperation.INS;
  }

  // Computation
  for (let i = 1; i < r.length + 1; i++) {
    for (let j = 1; j < h.length + 1; j++) {
      // OK
      if (r[i - 1].value === h[j - 1].value) {
        costs[i][j] = costs[i - 1][j - 1];
        backtrace[i][j] = DistanceOperation.OK;
        continue;
      }

      // Compound-Word
      if (
        opt.compoundWords &&
        r[i - 1].name !== TokenName.PUNCTUATION &&
        h[j - 1].name !== TokenName.PUNCTUATION
      ) {
        let [rLength, hLength] = isCompoundWord(r, h, i - 1, j - 1, 1, 1);

        if (rLength > 0 || hLength > 0) {
          for (let x = 0; x < rLength; x++) {
            const i2 = i + x;
            for (let y = 0; y < hLength; y++) {
              const j2 = j + y;

              if (x === 0) {
                if (y === 0) {
                  // Last word: Hypothesis and Reference
                  costs[i2][j2] = costs[i2][j2 - 1];
                  costs[i2][j2] = costs[i2 - 1][j2];
                  backtrace[i2][j2] = DistanceOperation.CONCAT_END;
                } else {
                  // Next word: Hypothesis
                  costs[i2][j2] = costs[i2][j2 - 1];
                  backtrace[i2][j2] = DistanceOperation.CONCAT_HYP;
                }
              } else {
                if (y === 0) {
                  // Last word: Hypothesis
                  costs[i2][j2] = costs[i2 - 1][j2];
                  backtrace[i2][j2] = DistanceOperation.CONCAT_REF;
                } else {
                  // Next word: Hypothesis
                  costs[i2][j2] = costs[i2][j2 - 1];
                  backtrace[i2][j2] = DistanceOperation.CONCAT_HYP;
                }
              }
            }
          }
          j += hLength - 1;
        }
      }

      // Operation is already set (e.g. through compound word or transposition)
      if (backtrace[i][j] !== DistanceOperation.NOOP) {
        continue;
      }

      // Substitution, Insertion, Deletion
      const substitutionPenalty = getSubstitutionPenalty(r[i - 1], h[j - 1]);
      const substitutionCost = costs[i - 1][j - 1] + substitutionPenalty;
      const insertionPenalty = getInsertionPenalty(h[j - 1]);
      const insertionCost = costs[i][j - 1] + insertionPenalty;
      const deletionPenalty = getDeletionPenalty(r[i - 1]);
      const deletionCost = costs[i - 1][j] + deletionPenalty;

      costs[i][j] = Math.min(substitutionCost, insertionCost, deletionCost);

      if (costs[i][j] === substitutionCost) {
        backtrace[i][j] = DistanceOperation.SUB;
      } else if (costs[i][j] === insertionCost) {
        backtrace[i][j] = DistanceOperation.INS;
      } else {
        backtrace[i][j] = DistanceOperation.DEL;
      }
    }
  }

  // back trace though the best route:
  let i = r.length;
  let j = h.length;
  let compound = false;

  const route: Route = [];
  while (i > 0 || j > 0) {
    switch (backtrace[i][j]) {
      case DistanceOperation.OK: {
        i -= 1;
        j -= 1;
        route.push({ ref: r[i], hyp: h[j], op: Operation.OK });
        break;
      }
      case DistanceOperation.SUB:
        i -= 1;
        j -= 1;
        route.push({
          ref: r[i],
          hyp: h[j],
          op: Operation.SUB,
          name: getSubstitutionName(r[i], h[j]),
        });
        break;
      case DistanceOperation.INS:
        j -= 1;
        route.push({
          hyp: h[j],
          op: Operation.INS,
        });
        break;
      case DistanceOperation.DEL:
        i -= 1;
        route.push({
          ref: r[i],
          op: Operation.DEL,
        });
        break;
      case DistanceOperation.CONCAT_HYP: {
        j -= 1;
        h[j - 1] = joinTokens([h[j - 1], h[j]]);
        compound = true;
        break;
      }
      case DistanceOperation.CONCAT_REF: {
        i -= 1;
        r[i - 1] = joinTokens([r[i - 1], r[i]]);
        compound = true;
        break;
      }
      case DistanceOperation.CONCAT_END: {
        i -= 1;
        j -= 1;
        route.push({
          ref: r[i],
          hyp: h[j],
          op: Operation.SUB,
          name: SubstitutionName.COMPOUND_WORD,
        });
        compound = false;
        break;
      }
      case DistanceOperation.ERROR: {
        throw new Error('Should never reach that route: Op.ERROR');
      }
      case DistanceOperation.NOOP: {
        throw new Error('Should never reach that route: Op.NOOP');
      }
      default:
        throw new Error('Should never reach that route: Op.None');
    }
  }

  route.reverse();

  return route;
};
