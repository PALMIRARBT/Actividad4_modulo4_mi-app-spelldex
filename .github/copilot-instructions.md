---
applyTo: "**/*.ts, **/*.tsx"
---

Js style guide:

- do NOT use classes, use functional components
- do NOT use `this` keyword
- do not use classes, use functions and modules
- use double quotes for strings
- at first level, use `function` keyword for function declarations
- use `const` for internal anonymous functions like callbacks or handlers inside components
- use always `export`. Do not use `export default`
- use `import` for importing modules
- use `import type { }` for importing types
- use `import { } from "./file"` for importing from local files
- use `import { } from "module"` for importing from node modules

Ts style guide:

- use `type` for types. Do not use `interface`
- do NOT use `enums` in typescript, use string literals.

Css style guide:

- css files should be named `*.module.css`
- import css files like this: `import styles from ".{file}.module.css"`
- use `.module.css` for styling files

Testing style guide:

- use jest for unit testing
- testing files should be named `*.test.ts` or `*.test.tsx` if its a component
- use `it` for test cases
