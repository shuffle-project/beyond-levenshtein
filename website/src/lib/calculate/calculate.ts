import { Measures, Options, Route } from '../interfaces';
import { createOptions } from '../options';
import { calculateMetrics } from './metrics';
import { summariseNormalisations } from './normalisations';
import { summarisePunctuation } from './punctuation';
import { summariseWords } from './words';

export const calculate = (route: Route, options?: Options): Measures => {
  const opt = createOptions(options);

  const words = summariseWords(route);
  const punctuation = summarisePunctuation(route);
  const normalisations = summariseNormalisations(route);

  const metrics = calculateMetrics(words, punctuation);

  return {
    metrics,
    words,
    punctuation,
    normalisations,
  };
};
