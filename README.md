# Beyond Levenshtein: Leveraging Multiple Algorithms for Robust Word Error Rate Computations And Granular Error Classifications

This repository contains the demo and implementation of a published paper for the Interspeech2024 conference.

Link to the [paper](https://doi.org/10.21437/Interspeech.2024-32).

## Demo

Try out the demo [here](https://shuffle-project.github.io/beyond-levenshtein/) to see the extended WER algorithm in action

or watch the video:

https://github.com/shuffle-project/beyond-levenshtein/assets/22795044/581e1f95-722c-44db-bf18-886b6c3d6f6c

## Quickstart

NodeJS is required.

The algorithm is implemented in typescript to enable the interactive visualisation as a website.

If you want to use the implementation programmatically:

You can start from the example directory [example/test.ts](example/test.ts):

```typescript
import { Operation, process } from "./../src/lib";

const reference = "The quick brown fox jumps over the lazy dog.";
const hypothesis = "the big brown fox and jumps over lazy dog!";

const result = process(reference, hypothesis);

// Log metrics
console.log(result.measures);

// Output
// {
//   metrics: {
//     wer: 0.3333333333333333,
//     mer: 0.3,
//     wil: 0.3950617283950617,
//     ier: 0.1111111111111111,
//     der: 0.1111111111111111,
//     punctuation: { errorRate: 1, f1Score: NaN },
//     capitalisation: { errorRate: 1, f1Score: 0 },
//     numbers: { errorRate: 0, f1Score: 1 }
//   },
//   words: { ... },
//   punctuation: { ... },
//   normalisations: { ... }
// }

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

// Output
// SUB: the -> The
// SUB: big -> quick
// OK: brown
// OK: fox
// INS: and
// OK: jumps
// OK: over
// DEL: the
// OK: lazy
// OK: dog
// SUB: ! -> .
```

To execute the typescript file:

```bash
tsx example/test.ts
```

## Citation

If you use this in your research, please cite the paper:

```bibtex
@inproceedings{kuhn24_interspeech,
  title     = {Beyond Levenshtein: Leveraging Multiple Algorithms for Robust Word Error Rate Computations And Granular Error Classifications},
  author    = {Korbinian Kuhn and Verena Kersken and Gottfried Zimmermann},
  year      = {2024},
  booktitle = {Interspeech 2024},
  pages     = {4543--4547},
  doi       = {10.21437/Interspeech.2024-32},
}
```
