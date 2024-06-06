import { Operation, process } from './../src/lib';

const reference = 'The quick brown fox jumps over the lazy dog.';
const hypothesis = 'the big brown fox and jumps over lazy dog!';

const result = process(reference, hypothesis, {
  lowercase: true,
  removePunctuation: true,
});

// Log metrics
console.log(result.measures);

// Log route
for (const item of result.route) {
  let message = `${Operation[item.op]}: `;
  switch (item.op) {
    case Operation.OK:
      message += `${item.hyp.value}`;
      break;
    case Operation.SUB:
      message += `${item.hyp.value} -> ${item.ref.value}`;
      break;
    case Operation.INS:
      message += `${item.hyp.value}`;
      break;
    case Operation.DEL:
      message += `${item.ref.value}`;
      break;
  }
  console.log(message);
}
