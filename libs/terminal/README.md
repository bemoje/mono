# @mono/terminal

Terminal utilities for interactive prompts and display management.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

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

## API Reference

| Function        | Description                                               |
| --------------- | --------------------------------------------------------- |
| `clearTerminal` | Clears the terminal screen using the system clear command |
| `confirmPrompt` | Prompts the user to confirm via a (y/n) question          |
