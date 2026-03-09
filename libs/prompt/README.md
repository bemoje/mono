# @bemoje/prompt

Interactive terminal prompt utilities for Node.js with a fluent builder API.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Installation

```bash
npm install @bemoje/prompt
```

## Features

- Fluent builder API for all prompt types
- 13 prompt types: text, number, confirm, password, select, multiselect, and more
- Searchable list prompt with fuzzy filtering
- Autocomplete and autocomplete-multiselect variants
- Built on the `prompts` npm package

## Usage

### Basic Prompts

```ts
import { prompt } from '@bemoje/prompt'

// Text input
const name = await prompt.text('What is your name?').run()

// Confirm (yes/no)
const ok = await prompt.confirm('Continue?').run()

// Number input
const age = await prompt.number('Enter your age:').run()

// Password (masked input)
const pw = await prompt.password('Enter password:').run()
```

### Selection Prompts

```ts
import { prompt } from '@bemoje/prompt'

// Single select from a list
const color = await prompt
  .select('Pick a color:')
  .choices([
    { title: 'Red', value: 'red' },
    { title: 'Blue', value: 'blue' },
    { title: 'Green', value: 'green' },
  ])
  .run()

// Multiple select
const colors = await prompt
  .multiselect('Pick colors:')
  .choices([
    { title: 'Red', value: 'red' },
    { title: 'Blue', value: 'blue' },
    { title: 'Green', value: 'green' },
  ])
  .run()
```

### Search Prompt

```ts
import { searchPrompt } from '@bemoje/prompt'

const result = await searchPrompt(['apple', 'banana', 'cherry', 'dragonfruit'])
// User types to fuzzy-filter the list, then selects a match
// result.selected => 'cherry'
// result.input    => the raw text typed
// result.matches  => all matching items
```

## API Reference

### Prompt Factory

| Method                        | Description                            |
| ----------------------------- | -------------------------------------- |
| `prompt.text(message)`        | Free-form text input                   |
| `prompt.number(message)`      | Numeric input                          |
| `prompt.confirm(message)`     | Yes/no confirmation                    |
| `prompt.password(message)`    | Masked password input                  |
| `prompt.invisible(message)`   | Invisible (hidden) input               |
| `prompt.list(message)`        | Comma-separated list input             |
| `prompt.toggle(message)`      | Toggle between two values              |
| `prompt.select(message)`      | Single selection from choices          |
| `prompt.multiselect(message)` | Multiple selection from choices        |
| `prompt.autocomplete(message)`| Autocomplete single selection          |
| `prompt.autocompleteMultiselect(message)` | Autocomplete multi-selection |
| `prompt.date(message)`        | Date input                             |
| `prompt.search(message)`      | Searchable list selection              |

### Other Exports

| Export                | Description                                                  |
| --------------------- | ------------------------------------------------------------ |
| `searchPrompt`        | Standalone search prompt with fuzzy filtering and results    |
| `AbstractUserPrompt`  | Base class for building custom prompt types                  |
| `suggestDefault`      | Default suggest/filter function for autocomplete prompts     |
