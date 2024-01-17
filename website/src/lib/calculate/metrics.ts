import { Metrics, Punctuation, Words } from '../interfaces';

const f1Score = (ok: number, sub: number, del: number, ins: number): number => {
  // precision is the number of true positive results divided by the number of all positive results, including those not identified correctly,
  const n_hyp = ok + sub + ins;
  if (n_hyp === 0) {
    return 0;
  }
  const precision = ok / n_hyp;

  // recall is the number of true positive results divided by the number of all samples that should have been identified as positive.
  const n_ref = ok + sub + del;
  if (n_ref === 0) {
    return 1;
  }
  const recall = ok / n_ref;

  const f1 = (2 * precision * recall) / (precision + recall);

  return f1;
};

const errorRate = (
  ok: number,
  sub: number,
  del: number,
  ins: number
): number => {
  const n = ok + sub + del;
  if (n === 0) {
    return 0;
  }
  return (sub + del + ins) / n;
};

export const wordErrorRate = (words: Words): number => {
  return errorRate(words.ok, words.sub, words.del, words.ins);
};

export const insertionErrorRate = (words: Words): number => {
  const n = words.ok + words.sub + words.del;
  if (n === 0) {
    return 0;
  }
  return words.ins / n;
};

export const deletionErrorRate = (words: Words): number => {
  const n = words.ok + words.sub + words.del;
  if (n === 0) {
    return 0;
  }
  return words.del / n;
};

export const matchErrorRate = (words: Words): number => {
  const n = words.ok + words.sub + words.del + words.ins;

  if (n === 0) {
    return 0;
  }

  return (words.sub + words.del + words.ins) / n;
};

export const wordInformationLost = (words: Words): number => {
  const n_ref = words.ok + words.sub + words.del;
  const n_hyp = words.ok + words.sub + words.ins;

  if (n_ref === 0) {
    return 0;
  }

  const wip = n_hyp >= 1 ? (words.ok / n_ref) * (words.ok / n_hyp) : 0;
  return 1 - wip;
};

export const punctuationErrorRate = (punctuation: Punctuation): number => {
  const ok = punctuation.ok - punctuation.meta.comma.ok;
  const sub = punctuation.sub - punctuation.meta.comma.sub;
  const del = punctuation.del - punctuation.meta.comma.del;
  const ins = punctuation.ins - punctuation.meta.comma.ins;
  return errorRate(ok, sub, del, ins);
};

export const punctuationF1Score = (punctuation: Punctuation): number => {
  const ok = punctuation.ok - punctuation.meta.comma.ok;
  const sub = punctuation.sub - punctuation.meta.comma.sub;
  const del = punctuation.del - punctuation.meta.comma.del;
  const ins = punctuation.ins - punctuation.meta.comma.ins;
  return f1Score(ok, sub, del, ins);
};

export const capitalisationErrorRate = (words: Words): number => {
  return errorRate(
    words.meta.capitalisation.ok,
    words.meta.capitalisation.sub,
    words.meta.capitalisation.del,
    words.meta.capitalisation.ins
  );
};

export const capitalisationF1Score = (words: Words): number => {
  return f1Score(
    words.meta.capitalisation.ok,
    words.meta.capitalisation.sub,
    words.meta.capitalisation.del,
    words.meta.capitalisation.ins
  );
};

export const numberErrorRate = (words: Words): number => {
  return errorRate(
    words.meta.numbers.ok,
    words.meta.numbers.sub,
    words.meta.numbers.del,
    words.meta.numbers.ins
  );
};

export const numberF1Score = (words: Words): number => {
  return f1Score(
    words.meta.numbers.ok,
    words.meta.numbers.sub,
    words.meta.numbers.del,
    words.meta.numbers.ins
  );
};

export const calculateMetrics = (
  words: Words,
  punctuation: Punctuation
): Metrics => {
  return {
    wer: wordErrorRate(words),
    mer: matchErrorRate(words),
    wil: wordInformationLost(words),
    ier: insertionErrorRate(words),
    der: deletionErrorRate(words),
    punctuation: {
      errorRate: punctuationErrorRate(punctuation),
      f1Score: punctuationF1Score(punctuation),
    },
    capitalisation: {
      errorRate: capitalisationErrorRate(words),
      f1Score: capitalisationF1Score(words),
    },
    numbers: {
      errorRate: numberErrorRate(words),
      f1Score: numberF1Score(words),
    },
  };
};
