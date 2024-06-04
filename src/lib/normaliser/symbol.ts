const CURRENCY_TO_SYMBOL_EXPRESSION: { [key: string]: string } = {
  $: 'dollar',
  '¢': 'cent',
  '£': 'pound',
  '€': 'euro',
};

const SYMBOL_EXPRESSION_TO_CURRENCY: { [key: string]: string } = {
  dollar: '$',
  dollars: '$',
  cent: '¢',
  cents: '¢',
  pound: '£',
  pounds: '£',
  euro: '€',
  euros: '€',
};

const SYMBOL_CHARACTERS: { [key: string]: string } = {
  ...CURRENCY_TO_SYMBOL_EXPRESSION,
  '%': 'percent',
};

const SYMBOL_EXPRESSIONS_SINGULAR = Object.values(SYMBOL_CHARACTERS);
const SYMBOL_EXPRESSIONS_PLURAL = [
  ...SYMBOL_EXPRESSIONS_SINGULAR,
  ...SYMBOL_EXPRESSIONS_SINGULAR.filter((o) => o !== 'percent').map(
    (o) => `${o}s`
  ),
];

export const isSymbolCharacter = (value: string): boolean => {
  return Object.keys(SYMBOL_CHARACTERS).includes(value);
};

export const isCurrencyExpression = (value: string): boolean => {
  return Object.hasOwn(SYMBOL_EXPRESSION_TO_CURRENCY, value);
};

export const isPercentExpression = (value: string): boolean => {
  return value.toLowerCase() === 'percent';
};

export const isSymbolExpression = (value: string): boolean => {
  return SYMBOL_EXPRESSIONS_PLURAL.includes(value.toLowerCase());
};

export const symbolExpressionToCurrencySign = (value: string): string => {
  if (Object.hasOwn(SYMBOL_EXPRESSION_TO_CURRENCY, value)) {
    return SYMBOL_EXPRESSION_TO_CURRENCY[value];
  }
  return value;
};

export const normalizeSymbol = (value: string): string => {
  if (Object.hasOwn(SYMBOL_CHARACTERS, value)) {
    return SYMBOL_CHARACTERS[value];
  }
  return value;
};
