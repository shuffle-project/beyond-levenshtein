import { calculate } from './calculate/calculate';
import { distance } from './distance';
import { Measures, Options, Route, Token } from './interfaces';
import { parse } from './lexer';
import { createOptions } from './options';

export { calculate } from './calculate/calculate';
export { distance } from './distance';
export * from './interfaces';
export { parse } from './lexer';
export { getStemmer } from './talisman';

export const process = (
  reference: string,
  hypothesis: string,
  options?: Options
): {
  measures: Measures;
  route: Route;
  reference: Token[];
  hypothesis: Token[];
} => {
  const opt = createOptions(options);

  const r = parse(reference, opt);
  const h = parse(hypothesis, opt);
  const route = distance(r, h, opt);
  const measures = calculate(route, opt);

  return {
    measures,
    route,
    reference: r,
    hypothesis: h,
  };
};
