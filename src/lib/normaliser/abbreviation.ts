export const ABBREVIATIONS: { [key: string]: RegExp } = {
  // Common abbreviations
  'et cetera': /^etc.$/i,
  versus: /^vs.$/i,

  // Titles: List retrieved from: https://github.com/openai/whisper/blob/main/whisper/normalizers/english.py
  madam: /^ma'am$/i,
  mister: /^mr\.?$/i,
  missus: /^mrs\.?$/i,
  saint: /^st\.?$/i, // could also mean street
  doctor: /^dr\.?$/i, // could also mean drive
  professor: /^prof\.?$/i,
  captain: /^capt\.?$/i,
  governor: /^gov\.?$/i,
  alderman: /^ald\.?$/i,
  general: /^gen\.?$/i,
  representative: /^rep\.?$/i,
  president: /^pres\.?$/i,
  reverend: /^rev\.?$/i,
  honorable: /^hon\.?$/i,
  assistant: /^asst\.?$/i,
  associate: /^assoc\.?$/i,
  lieutenant: /^lt\.?$/i,
  colonel: /^col\.?$/i,
  junior: /^jr\.?$/i,
  senior: /^sr\.?$/i,
  esquire: /^esq\.?$/i,

  // Street names
  avenue: /^ave.$/i,
  boulevard: /^blvd.$/i,
  canyon: /^cyn.$/i,
  // 'drive': /^dr.$/i,// already used for doctor
  lane: /^ln.$/i,
  road: /^rd.$/i,
  // 'street': /^st.$/i,// already used for saint
};

export const isAbbreviation = (value: string): boolean => {
  for (const regex of Object.values(ABBREVIATIONS)) {
    if (value.match(regex)) {
      return true;
    }
  }
  return false;
};

export const isGenericAbbreviationSegment = (value: string): boolean => {
  return !!value.match(/^([A-Z]{1}\.)+$/gi);
};

export const isGenericAbbreviation = (value: string): boolean => {
  return !!value.match(/^([A-Z]{1}\.){2,}$/gi);
};

export const isAbbreviationExpression = (value: string): boolean => {
  const v = value.toLowerCase();
  return Object.keys(ABBREVIATIONS).includes(value);
};

export const normalizeAbbreviation = (value: string): string => {
  for (const [replacement, pattern] of Object.entries(ABBREVIATIONS)) {
    if (value.match(pattern)) {
      const normalized = value.replace(pattern, replacement);
      // Eventually keep casing of first character
      return value[0] + normalized.substring(1);
    }
  }
  return value;
};
