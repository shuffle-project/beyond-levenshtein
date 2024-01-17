const ZEROS: { [key: string]: number } = {
  o: 0,
  oh: 0,
  zero: 0,
};

export const ONES: { [key: string]: number } = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  thirteen: 13,
  fourteen: 14,
  fifteen: 15,
  sixteen: 16,
  seventeen: 17,
  eighteen: 18,
  nineteen: 19,
};

const ONES_PLURAL: { [key: string]: [number, string] } = {
  ones: [1, 's'],
  twos: [2, 's'],
  threes: [3, 's'],
  fours: [4, 's'],
  fives: [5, 's'],
  sixes: [6, 's'],
  sevens: [7, 's'],
  eights: [8, 's'],
  nines: [9, 's'],
  tens: [10, 's'],
  elevens: [11, 's'],
  twelves: [12, 's'],
  thirteens: [13, 's'],
  fourteens: [14, 's'],
  fifteens: [15, 's'],
  sixteens: [16, 's'],
  seventeens: [17, 's'],
  eighteens: [18, 's'],
  nineteens: [19, 's'],
};

const ONES_ORDINAL: { [key: string]: [number, string] } = {
  zeroth: [0, 'th'],
  first: [1, 'st'],
  second: [2, 'nd'],
  third: [3, 'rd'],
  fourth: [4, 'th'],
  fifth: [5, 'th'],
  sixth: [6, 'th'],
  seventh: [7, 'th'],
  eigth: [8, 'th'],
  nineth: [9, 'th'],
  tenth: [10, 'th'],
  eleventh: [11, 'th'],
  twelfth: [12, 'th'],
  thirteenth: [13, 'th'],
  fourteenth: [14, 'th'],
  fifteenth: [15, 'th'],
  sixteenth: [16, 'th'],
  seventeenth: [17, 'th'],
  eighteenth: [18, 'th'],
  nineteenth: [19, 'th'],
};

export const TENS: { [key: string]: number } = {
  twenty: 20,
  thirty: 30,
  forty: 40,
  fifty: 50,
  sixty: 60,
  seventy: 70,
  eighty: 80,
  ninety: 90,
};

const TENS_PLURAL: { [key: string]: [number, string] } = {
  twenties: [20, 's'],
  thirties: [30, 's'],
  forties: [40, 's'],
  fifties: [50, 's'],
  sixties: [60, 's'],
  seventies: [70, 's'],
  eighties: [80, 's'],
  nineties: [90, 's'],
};

const TENS_ORDINAL: { [key: string]: [number, string] } = {
  twentieth: [20, 'th'],
  thirtieth: [30, 'th'],
  fortieth: [40, 'th'],
  fiftieth: [50, 'th'],
  sixtieth: [60, 'th'],
  seventieth: [70, 'th'],
  eightieth: [80, 'th'],
  ninetieth: [90, 'th'],
};

export const MULTIPLIERS: { [key: string]: number } = {
  hundred: 100,
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
  trillion: 1000000000000,
  quadrillion: 1000000000000000,
};

const MULTIPLIERS_PLURAL: { [key: string]: [number, string] } = {
  hundreds: [100, 's'],
  thousands: [1000, 's'],
  millions: [1000000, 's'],
  billions: [1000000000, 's'],
  trillions: [1000000000000, 's'],
  quadrillions: [1000000000000000, 's'],
};

const MULTIPLIERS_ORDINAL: { [key: string]: [number, string] } = {
  hundredth: [100, 'th'],
  thousandth: [1000, 'th'],
  millionth: [1000000, 'th'],
  billionth: [1000000000, 'th'],
  trillionth: [1000000000000, 'th'],
  quadrillionth: [1000000000000000, 'th'],
};

export const PREFIXES: { [key: string]: string } = {
  minus: '-',
  negative: '-',
  '-': '-',
  plus: '+',
  positive: '+',
  '+': '+',
};

export const SPECIALS: string[] = ['and', 'double', 'triple', 'point'];

export const WORDS = { ...ZEROS, ...ONES, ...TENS, ...MULTIPLIERS };

export const ONES_SUFFIXED = {
  ...ONES_PLURAL,
  ...ONES_ORDINAL,
};

export const TENS_SUFFIXED = {
  ...TENS_PLURAL,
  ...TENS_ORDINAL,
};

export const MULTIPLIERS_SUFFIXED = {
  ...MULTIPLIERS_PLURAL,
  ...MULTIPLIERS_ORDINAL,
};

export const WORDS_SUFFIXED = {
  ...ONES_SUFFIXED,
  ...TENS_SUFFIXED,
  ...MULTIPLIERS_SUFFIXED,
};

export const ALL_WORDS: string[] = [
  ...Object.keys(WORDS),
  ...Object.keys(WORDS_SUFFIXED),
  ...Object.keys(PREFIXES),
  ...SPECIALS,
];
