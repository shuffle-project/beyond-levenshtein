import {
  Normalisations,
  Operation,
  Route,
  TokenNormalisation,
} from '../interfaces';

export const summariseNormalisations = (route: Route): Normalisations => {
  const result = Object.fromEntries(
    Object.values(TokenNormalisation).map((o) => [o, 0])
  ) as Normalisations;

  for (const element of route) {
    const normalisations: TokenNormalisation[] = [];
    switch (element.op) {
      case Operation.OK:
      case Operation.SUB:
        normalisations.push(
          ...element.ref.normalisations,
          ...element.hyp.normalisations
        );
        break;
      case Operation.DEL:
        normalisations.push(...element.ref.normalisations);
        break;
      case Operation.INS:
        normalisations.push(...element.hyp.normalisations);
        break;
    }
    for (const normalisation of normalisations) {
      result[normalisation]++;
    }
  }

  return result;
};
