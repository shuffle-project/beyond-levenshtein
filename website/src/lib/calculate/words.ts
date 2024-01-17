import {
  Operation,
  Route,
  SubstitutionName,
  TokenName,
  Words,
} from '../interfaces';

export const summariseWords = (route: Route): Words => {
  const result: Words = {
    ok: 0,
    ins: 0,
    del: 0,
    sub: 0,
    meta: {
      substitutions: {
        affixes: 0,
        capitalisation: 0,
        compoundWords: 0,
        homophones: 0,
        numbers: 0,
        prefixes: 0,
        stemmers: 0,
        suffixes: 0,
        unspecified: 0,
      },
      capitalisation: {
        ok: 0,
        ins: 0,
        del: 0,
        sub: 0,
      },
      numbers: {
        ok: 0,
        ins: 0,
        del: 0,
        sub: 0,
      },
    },
  };

  for (const element of route) {
    switch (element.op) {
      case Operation.OK:
        if (element.ref.name !== TokenName.PUNCTUATION) {
          result.ok++;
          if (element.ref.name === TokenName.NUMBER) {
            result.meta.numbers.ok++;
          }
          // True-cased
          if (element.ref.value !== element.ref.value.toLowerCase()) {
            result.meta.capitalisation.ok++;
          }
        }
        break;
      case Operation.DEL:
        if (element.ref.name !== TokenName.PUNCTUATION) {
          result.del++;
          if (element.ref.name === TokenName.NUMBER) {
            result.meta.numbers.del++;
          }
        }
        break;
      case Operation.INS:
        if (element.hyp.name !== TokenName.PUNCTUATION) {
          result.ins++;
          if (element.hyp.name === TokenName.NUMBER) {
            result.meta.numbers.ins++;
          }
        }
        break;
      case Operation.SUB:
        if (element.ref.name !== TokenName.PUNCTUATION) {
          switch (element.name) {
            case SubstitutionName.CAPITALISATION: {
              result.ok++;
              result.meta.substitutions.capitalisation++;
              if (element.hyp.value.toLowerCase() === element.hyp.value) {
                result.meta.capitalisation.del++;
              } else if (
                element.ref.value.toLowerCase() ===
                element.ref.value.toLowerCase()
              ) {
                result.meta.capitalisation.ins++;
              } else {
                result.meta.capitalisation.sub;
              }
              break;
            }
            case SubstitutionName.COMPOUND_WORD:
              result.ok++;
              result.meta.substitutions.compoundWords++;
              break;
            case SubstitutionName.PREFIX:
              result.sub++;
              result.meta.substitutions.prefixes++;
              break;
            case SubstitutionName.SUFFIX:
              result.sub++;
              result.meta.substitutions.suffixes++;
              break;
            case SubstitutionName.AFFIX:
              result.sub++;
              result.meta.substitutions.affixes++;
              break;
            case SubstitutionName.STEMMER:
              result.sub++;
              result.meta.substitutions.stemmers++;
              break;
            case SubstitutionName.HOMOPHONE:
              result.sub++;
              result.meta.substitutions.homophones++;
              break;
            case SubstitutionName.NUMBER:
              result.sub++;
              result.meta.substitutions.numbers++;
              result.meta.numbers.sub++;
              break;
            default:
              result.sub++;
              result.meta.substitutions.unspecified++;
          }
        }
        break;
    }
  }

  return result;
};
