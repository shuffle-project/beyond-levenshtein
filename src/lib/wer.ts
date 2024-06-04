import { Operation } from './interfaces';

// WER algorithm inspired by: https://holianh.github.io/portfolio/Cach-tinh-WER/

const normalize = (
  value: string,
  capitalisation: boolean,
  punctuation: boolean
): string => {
  let normalized = value.replaceAll(/[\t\n]/g, ' ');

  if (!capitalisation) {
    normalized = normalized.toLowerCase();
  }

  if (!punctuation) {
    normalized = normalized.replaceAll(/[.,!?:;-]/g, ' ');
  }

  normalized = normalized.replaceAll(/\s\s+/g, ' ');

  return normalized;
};

export const calculateWER = (
  reference: string,
  hypothesis: string,
  capitalisation: boolean,
  punctuation: boolean
) => {
  const r = normalize(reference, capitalisation, punctuation).split(' ');
  const h = normalize(hypothesis, capitalisation, punctuation).split(' ');

  // costs will holds the costs, like in the Levenshtein distance algorithm
  const costs = new Array(r.length + 1)
    .fill(null)
    .map(() => new Array(h.length + 1).fill(0));

  // backtrace will hold the operations we've done so we could later backtrace, like the WER algorithm requires us to.
  const backtrace = new Array(r.length + 1)
    .fill(null)
    .map(() => new Array(h.length + 1).fill(0));

  // First column represents the case where we achieve zero hypothesis words by deleting all reference words.
  for (let i = 1; i < r.length + 1; i++) {
    costs[i][0] = 1 * i;
    backtrace[i][0] = Operation.DEL;
  }

  // First row represents the case where we achieve the hypothesis by inserting all hypothesis words into a zero-length reference.
  for (let i = 1; i < h.length + 1; i++) {
    costs[0][i] = 1 * i;
    backtrace[0][i] = Operation.INS;
  }

  // Computation
  for (let i = 1; i < r.length + 1; i++) {
    for (let j = 1; j < h.length + 1; j++) {
      if (r[i - 1] === h[j - 1]) {
        costs[i][j] = costs[i - 1][j - 1];
        backtrace[i][j] = Operation.OK;
        continue;
      }

      const substitutionCost = costs[i - 1][j - 1] + 1;
      const insertionCost = costs[i][j - 1] + 1;
      const deletionCost = costs[i - 1][j] + 1;

      costs[i][j] = Math.min(substitutionCost, insertionCost, deletionCost);

      if (costs[i][j] === substitutionCost) {
        backtrace[i][j] = Operation.SUB;
      } else if (costs[i][j] === insertionCost) {
        backtrace[i][j] = Operation.INS;
      } else {
        backtrace[i][j] = Operation.DEL;
      }
    }
  }

  // back trace though the best route:
  let i = r.length;
  let j = h.length;

  let numSub = 0;
  let numDel = 0;
  let numIns = 0;
  let numOk = 0;

  while (i > 0 || j > 0) {
    switch (backtrace[i][j]) {
      case Operation.OK: {
        numOk++;
        i -= 1;
        j -= 1;
        break;
      }
      case Operation.SUB:
        numSub++;
        i -= 1;
        j -= 1;
        break;
      case Operation.INS:
        numIns++;
        j -= 1;
        break;
      case Operation.DEL:
        numDel++;
        i -= 1;
        break;
    }
  }

  return (numIns + numDel + numSub) / r.length;
};
