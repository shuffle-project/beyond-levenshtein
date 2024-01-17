// Based on: https://github.com/openai/whisper/blob/main/whisper/normalizers/basic.py

export const ADDITIONAL_DIACRITICS: { [key: string]: string } = {
  Ä: 'Ae',
  ä: 'ae',
  Ö: 'Oe',
  ö: 'oe',
  Ü: 'Ue',
  ü: 'ue',
  œ: 'oe',
  Œ: 'OE',
  ø: 'o',
  Ø: 'O',
  æ: 'ae',
  Æ: 'AE',
  ß: 'ss',
  ẞ: 'SS',
  đ: 'd',
  Đ: 'D',
  ð: 'd',
  Ð: 'D',
  þ: 'th',
  Þ: 'th',
  ł: 'l',
  Ł: 'L',
};

const ADDITIONAL_DIACRITICS_NORMALIZED = Object.fromEntries(
  Object.entries(ADDITIONAL_DIACRITICS).map(([key, value]) => {
    return [key.normalize('NFKD'), value];
  })
);

export const normalizeDiacritics = (value: string): string => {
  return Array.from(value)
    .map((o) => {
      const c = o.normalize('NFKD');
      if (Object.hasOwn(ADDITIONAL_DIACRITICS, c)) {
        return ADDITIONAL_DIACRITICS_NORMALIZED[c];
      }
      return c;
    })
    .join('');
};
