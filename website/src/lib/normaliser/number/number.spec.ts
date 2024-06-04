import { parse } from '../../lexer';

const expect = (value: string, toEqual: string[]) => {
  const tokens = parse(value);

  const actual = tokens.map((o) => `${o.before}${o.value}${o.after}`).join('');
  const expected = toEqual.join('');

  if (actual !== expected) {
    console.log(`${value} -> ${actual} !== ${expected}`);
    process.exit();
  }

  if (tokens.length !== toEqual.length) {
    console.log(
      `Unexpected token length: ${value} -> ${tokens.length} tokens, expected ${toEqual.length}`
    );
    process.exit();
  }
};

// // No numbers
// expect('oh dear', ['oh ', 'dear']);
// expect('1.2.3', ['1.2.3']); // TODO

// Written numbers
// expect('two', ['2']);
// expect('thirty one', ['31']);
// expect('five twenty four', ['524']);
// expect('nineteen ninety nine', ['1999']);
// expect('twenty nineteen', ['2019']);
// expect('three thousand twenty nine', ['3029']);
// expect('forty three thousand two hundred sixty', ['43260']); // TODO
// expect('forty three thousand two hundred and sixty', ['43260']); // TODO
// expect('two thousand eight two', ['2008 ', '2']);
// expect('two point five million', ['2500000']);
// expect('200 thousand', ['200000']);
// expect('three billion', ['3000000000']);

// // Ordinals, plurals
// expect('nineteen fifties', ['1950s']);
// expect('thirty first', ['31st']);
// expect('thirty three thousand and three hundred and thirty third', ['33333rd']); // TODO
// expect('two thousandth', ['2000th']);
// expect('thirty two thousandth', ['32000th']);
// expect('10th', ['10th']);
// expect('10 th', ['10th']); // TODO
// expect('millions', ['1000000s']);

// Numerals
// expect('1,600', ['1600']);
// expect('1,600.60', ['1600.60']);
// expect('1,600,60', ['1600', ',', '60']);
// expect('1_000_000', ['1000000']);
// expect('3 14', ['3 ', '14']);
// expect('3.14', ['3.14']);

// // Ones
// expect('one', ['one']);
// expect('ones', ['ones']);

// // Compounds
// expect('Nineteen-ninety five', ['1995']);
// expect('Nineteen-ninety 5', ['1995']); // TODO

// // Currency, percent
// expect('200 thousand dollars', ['$200000']);
// expect('$20 million', ['$20000000']);
// expect('€52.4 million', ['€52400000']);
// expect('£77 thousands', ['£77000s']);
// expect('two point two five dollars', ['$2.25']);
// expect('two hundred million dollars', ['$200000000']);
// expect('$20.1 million', ['$20100000']);
// expect('$2.70', ['$2.70']);
// expect('two dollars and seventy cents', ['$2.70']);
// expect('3 cents', ['¢3']);
// expect('$0.36', ['¢36']);
// expect('three euros and sixty five cents', ['€3.65']);
// expect('ninety percent', ['90%']);

// // Point, and a half
// expect('point 89 point 9', ['.89 ', '.9']);
// // expect('forty eight and a half dollars', ['$48.5']); // TODO
// expect('3 point 2', ['3.2']);
// expect('3 point 14', ['3.14']);
// // expect('three and a half million', ['3500000']); // TODO
// expect('fourteen point 4', ['14.4']);
// expect('four point two billions', ['4200000000s']);

// Doubles
expect('two double o eight', ['2008']);
expect('double oh seven', ['007']);
expect('double zero seven', ['007']);
expect('nine one one', ['911']);
expect('nine double one', ['911']);
expect('one triple oh one', ['10001']);

// // Dates
// expect('July third twenty twenty', ['July ', '3rd ', '2020']); // TODO
// expect('august twenty sixth twenty twenty one', ['august ', '26th ', '2021']); // TODO

// // Prefixes
// expect('minus 500', ['-500']);
// expect('positive twenty thousand', ['+20000']);

// // Abbreviations
// expect('b747', ['b747']); // TODO
// expect('wd40', ['wd40']); // TODO
// expect('WD-fourty', ['WD-40']); // TODO
// expect('wd-40', ['wd-40']); // TODO
