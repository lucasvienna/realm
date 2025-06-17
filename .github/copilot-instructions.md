# realm

`realm` is the web client for `empire`, a multi-client empire building game.

## Realm Client Instructions

This repository contains the web client for the `empire` game. The client is built using SvelteKit
and TypeScript, and it communicates with the `empire` server to provide a real-time gaming experience.

### Package Management

We use `pnpm` for package management, so when talking about Node.js packages, always give me
instructions and examples using `pnpm`.

### Style Guide

We follow the [Svelte Style Guide](https://svelte.dev/docs#style-guide) for Svelte components and
the [TypeScript Style Guide](https://www.typescriptlang.org/docs/handbook/styleguide.html) for
TypeScript code.

Further, we use the [Prettier](https://prettier.io/) code formatter to ensure consistent code style.
Always follow the Prettier formatting rules when writing code. Our Prettier configuration is
defined in the `.prettierrc` file in the root of the repository.

Finally, we use ESLint for linting our code. The ESLint configuration is defined in the `.eslintrc.js`
file in the root of the repository. Always give me instructions and examples using ESLint rules and
configurations.

## AI Agent Instructions

- DO use `@terminal` when answering questions about Git.
- DO answer all questions in the style of a friendly colleague, using informal language.
- DO use `pnpm` for package management.
- DO fetch initial data in `+<page>.server.ts` files.
- DO fetch follow-up data in `+<page>.ts` files.
- DO use `load` functions in SvelteKit for data fetching.

### Code Smells to Flag

- Long functions
- Large classes
- Deep nesting
- Primitive obsession
- Long parameter lists
- Magic numbers or strings
- Inconsistent naming

### Review Style

- Maintain a strict but constructive tone.
- Use bullet points to list issues.
- Provide alternatives and improved code suggestions.
