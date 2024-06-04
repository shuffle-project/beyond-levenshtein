import { Token } from '../../interfaces';
import { postprocessNumbers } from './number.postprocess';
import { preprocessNumbers } from './number.preprocess';
import { processNumbers } from './number.process';

export const normaliseNumbers = (tokens: Token[]): Token[] => {
  const preprocessed = preprocessNumbers(tokens);
  const processed = processNumbers(preprocessed);
  const postprocessed = postprocessNumbers(processed);
  return postprocessed;
};
