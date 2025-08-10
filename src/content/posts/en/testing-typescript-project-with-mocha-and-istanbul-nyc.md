---
abbrlink: 402d9408
categories:
  - CS
  - Web
date: 2024-02-08 12:00:07
tags:
  - typescript
  - javascript
  - testing
  - mocha
  - nyc
title: Testing Typescript project with Mocha and Istanbul NYC
---

[Mocha](https://mochajs.org/) is a popular JS test framework, and [Istanbul](https://istanbul.js.org/) is a popular JS test coverage tool. How to use them when it comes to Typescript? This post shows a simple demo.

<!--more-->

## Creating a basic TS Project

Let's create a very basic Typescript project as our demo.

First, create a directory to store this project:

```bash
mkdir ts_mocha_nyc_demo
cd ts_mocha_nyc_demo
```

Initialize this directory as a new npm project with the command below, which generates a `package.json` file with default configuration.

```bash
npm init -y
```

Then, install Typescript in this npm project:

```bash
npm install --save-dev typescript
npm install --save-dev @types/node # you may also need this
```

Initialize Typescript with the command below, which generates a `tsconfig.json` file with default configuration.

```json
tsc --init
```

Finally, write some code for testing later.

```bash
mkdir src && touch src/divide.ts
```

Edit `src/divide.ts`:

```ts
export const divide = (a: number, b: number): number => {
  if (b === 0) throw new Error("The divisor cannot be 0");
  return a / b;
};
```

## Setting up Mocha and Run Test

### Installing Chai and Mocha

[Chai](https://www.chaijs.com/) is an assertion library working well with Mocha. We often use them together.

To install Chai, Mocha, and their type definitions, run the following commands:

```bash
npm install --save-dev chai @types/chai
npm install --save-dev mocha @types/mocha
```

### Writing Test Code

Create a `test` directory and create a `divide.test.ts` for testing `divide.ts`:

```bash
mkdir test && touch test/divide.test.ts
```

Edit `test/divide.test.ts`:

```ts
import { assert, expect } from "chai";
import { divide } from "../src/divide";

describe("Division Test", () => {
  it("should return 2 when divide(4, 2) called", () => {
    const actualResult = divide(4, 2);
    const expectedResult = 2;
    assert.strictEqual(actualResult, expectedResult);
  });

  it("should throw error when divide(4, 0) called", () => {
    expect(() => {
      divide(4, 0);
    }).to.throw(Error, "The divisor cannot be 0");
  });
});
```

### Running Test

Note that mocha is natively a JS test framework, and we need to configure it before we can test TS code with it.

First, install `cross-env` and `tsx`:

```bash
npm install --save-dev cross-env tsx
```

> [!Note]
> [cross-env](https://www.npmjs.com/package/cross-env) is a useful tool for setting environment variables across platforms.
> [!WARNING]
> I tried [ts-node](https://github.com/TypeStrong/ts-node) just like the [example](https://github.com/mochajs/mocha-examples/tree/master/packages/typescript) provided by Mocha but I encountered an `ERR_UNKNOWN_FILE_EXTENSION` like [this](https://github.com/TypeStrong/ts-node/issues/1997). Finally I use [tsx](https://github.com/privatenumber/tsx) and it works.

Update `package.json` to be like this:

```json
{
  ...
  "scripts": {
    "test": "cross-env NODE_OPTIONS='--import tsx' mocha 'test/**/*.test.ts'"
  },
  ...
}
```

Now, you can run test by running the command below:

```bash
npm test
```

You will see output like:

```text

> ts_mocha_nyc_demo@1.0.0 test
> cross-env NODE_OPTIONS='--import tsx' mocha 'test/**/*.test.ts'



  Division Test
    ✔ should return 2 when divide(4, 2) called
    ✔ should throw error when divide(4, 0) called


  2 passing (3ms)

```

## Setting up Istanbul NYC and Run Coverage Test

### Installing Istanbul NYC

To install Istanbul NYC, run:

```bash
npm install --save-dev nyc @istanbuljs/nyc-config-typescript
```

### Configuring Istanbul NYC

Create a `.nycrc.json` and edit:

```json
{
  "extends": "@istanbuljs/nyc-config-typescript",
  "include": ["src/**/*.ts"],
  "exclude": ["test/**/*.test.ts"],
  "reporter": ["html", "text", "text-summary"],
  "report-dir": "coverage"
}
```

### Running Coverage Test

Update `package.json`:

```json
{
  ...
  "scripts": {
    "coverage": "nyc npm test",
    "test": "cross-env NODE_OPTIONS='--import tsx' mocha 'test/**/*.test.ts'"
  },
  ...
}
```

Run the coverage test with:

```bash
npm run coverage
```

The output may be:

```text

> ts_mocha_nyc_demo@1.0.0 coverage
> nyc npm test


> ts_mocha_nyc_demo@1.0.0 test
> cross-env NODE_OPTIONS='--import tsx' mocha 'test/**/*.test.ts'



  Division Test
    ✔ should return 2 when divide(4, 2) called
    ✔ should throw error when divide(4, 0) called


  2 passing (2ms)

-----------|---------|----------|---------|---------|-------------------
| File        | % Stmts   | % Branch   | % Funcs   | % Lines   | Uncovered Line #s   |
| ----------- | --------- | ---------- | --------- | --------- | ------------------- |
| All files   | 100       | 85.71      | 100       | 100       |
| divide.ts   | 100       | 85.71      | 100       | 100       | 1                   |
| ----------- | --------- | ---------- | --------- | --------- | ------------------- |

=============================== Coverage summary ===============================
Statements   : 100% ( 5/5 )
Branches     : 85.71% ( 6/7 )
Functions    : 100% ( 2/2 )
Lines        : 100% ( 3/3 )
================================================================================
```

You can also see the result in a web ui by opening `./coverage/index.html`.

## Resources

- _[Mocha for TypeScript Testing: How to Get Started - Testim Blog](https://www.testim.io/blog/mocha-for-typescript-testing/)_
- _[Test coverage report in Typescript with Mocha and NYC | by Carlos Lucero | Medium](https://medium.com/@ocnvn/test-coverage-report-in-typescript-with-mocha-and-nyc-a6b10cbec24)_
