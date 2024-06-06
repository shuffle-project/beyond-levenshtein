# Beyond Levenshtein: Leveraging Multiple Algorithms for Robust Word Error Rate Computations And Granular Error Classifications

This repository contains the demo and implementation of a published paper for the Interspeech2024 conference.

Link to the paper [NOT PUBLISHED YET].

## Demo

Try out the demo [here](https://shuffle-project.github.io/beyond-levenshtein/) to see the extended WER algorithm in action

or watch the video:

![Demo Video](demo-video.mp4)

## Quickstart

NodeJS is required.

The algorithm is implemented in typescript to enable the interactive visualisation as a website.

If you want to use the implementation programmatically:

You can start from the example directory [example/test.ts](example/test.ts):

```typescript
import { Operation, process } from "./../src/lib";

const reference = "The quick brown fox jumps over the lazy dog.";
const hypothesis = "the big brown fox and jumps over lazy dog!";

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
```

To execute the typescript file:

```bash
tsx example/test.ts
```
