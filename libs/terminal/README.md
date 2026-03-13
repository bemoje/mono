# @mono/terminal

Terminal utilities for interactive prompts and display management.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**clearTerminal**](./src/clearTerminal.ts): Clears the terminal screen using the system's clear command.
- [**confirmPrompt**](./src/confirmPrompt.ts): Prompts the user to confirm in the terminal.

<!-- EXPORTS_END -->

## Usage

### Interactive Prompts

```ts
import { confirmPrompt } from '@mono/terminal'

const isSure = await confirmPrompt('Are you sure you want to deploy?')
if (isSure) {
  // Proceed with deployment
}
```

### Screen Management

```ts
import { clearTerminal } from '@mono/terminal'

// Clears the terminal screen
clearTerminal()
```
