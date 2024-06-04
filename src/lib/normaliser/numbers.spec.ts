import { parse } from '../lexer';

const convert = (value: string): string => {
  const tokens = parse(value);
  return tokens
    .map((o) => [o.before, o.value, o.after].join(''))
    .join('')
    .trim();
};

const compare = (value: string, toBe: string) => {
  const converted = convert(value);
  if (converted !== toBe) {
    // console.log(parse(value));
    console.log(`${value} -> ${converted} !== ${toBe}`);
    process.exit();
  }
};

// compare('two thousand eight two', '2008 2');

compare('3 14', '3 14');

compare('Nineteen-ninety five', '1995');
compare('Nineteen-ninety 5', '1995');
compare('oh dear', 'oh dear');

compare('1.2.3', '1.2.3');
compare('point 89 point 9', '.89 .9');
compare('1,600', '1600');
compare('1,600.60', '1600.60');
compare('1,600,60', '1600,60');
compare('1_000_000', '1000000');

compare('two', '2');
compare('thirty one', '31');
compare('five twenty four', '524');
compare('nineteen ninety nine', '1999');
compare('twenty nineteen', '2019');

compare('two point five million', '2500000');
compare('four point two billions', '4200000000s');
compare('200 thousand', '200000');
compare('200 thousand dollars', '$200000');
compare('$20 million', '$20000000');
compare('€52.4 million', '€52400000');
compare('£77 thousands', '£77000s');

compare('two double o eight', '2008');

compare('three thousand twenty nine', '3029');
compare('forty three thousand two hundred sixty', '43260');
compare('forty three thousand two hundred and sixty', '43260');

compare('nineteen fifties', '1950s');
compare('thirty first', '31st');
compare('thirty three thousand and three hundred and thirty third', '33333rd');

compare('three billion', '3000000000');
compare('millions', '1000000s');

compare('july third twenty twenty', 'july 3rd 2020');
compare('august twenty sixth twenty twenty one', 'august 26th 2021');
compare('3 14', '3 14');
compare('3.14', '3.14');
compare('3 point 2', '3.2');
compare('3 point 14', '3.14');
compare('fourteen point 4', '14.4');
compare('two point two five dollars', '$2.25');
compare('two hundred million dollars', '$200000000');
compare('$20.1 million', '$20100000');

compare('ninety percent', '90%');

compare('double oh seven', '007');
compare('double zero seven', '007');
compare('nine one one', '911');
compare('nine double one', '911');
compare('one triple oh one', '10001');

compare('two thousandth', '2000th');
compare('thirty two thousandth', '32000th');

compare('minus 500', '-500');
compare('positive twenty thousand', '+20000');

compare('$2.70', '$2.70');
compare('two dollars and seventy cents', '$2.70');
compare('3 cents', '¢3');
compare('$0.36', '¢36');
compare('three euros and sixty five cents', '€3.65');

compare('three and a half million', '3500000');
compare('forty eight and a half dollars', '$48.5');
compare('b747', 'b747');
compare('10 th', '10th');
compare('10th', '10th');

compare('one', 'one');
compare('1', 'one');
compare('ones', 'ones');
