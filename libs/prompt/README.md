# @bemoje/prompt

Interactive terminal prompt utilities for Node.js with a fluent builder API.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**AbstractUserPrompt**](./src/prompt/core/AbstractUserPrompt.ts): Interactive terminal user prompts.
- [**AutocompleteMultiselectPrompt**](./src/prompt/core/AutocompleteMultiselectPrompt.ts): Interactive multiselect user prompts in the terminal.
- [**AutocompletePrompt**](./src/prompt/core/AutocompletePrompt.ts): Interactive autocomplete user prompts in the terminal.
- [**ConfirmPrompt**](./src/prompt/core/ConfirmPrompt.ts): Interactive confirm user prompts in the terminal.
- [**DatePrompt**](./src/prompt/core/DatePrompt.ts): Interactive date user prompts in the terminal.
- [**InvisiblePrompt**](./src/prompt/core/InvisiblePrompt.ts): Interactive invisible user prompts in the terminal.
- [**ListPrompt**](./src/prompt/core/ListPrompt.ts): Interactive list user prompts in the terminal.
- [**MultiselectPrompt**](./src/prompt/core/AutocompleteMultiselectPrompt.ts): Interactive multiselect user prompts in the terminal.
- [**NumberPrompt**](./src/prompt/core/NumberPrompt.ts): Interactive numner user prompts in the terminal.
- [**PROMPT_META_DATA**](./src/prompt/additions/searchPrompt/core/PROMPT_META_DATA.ts): WeakMap storing search prompt meta data associated with each prompt object.
- [**PasswordPrompt**](./src/prompt/core/PasswordPrompt.ts): Interactive password user prompts in the terminal.
- [**SearchPrompt**](./src/prompt/core/SearchPrompt.ts): Interactive autocomplete user prompts in the terminal.
- [**SelectPrompt**](./src/prompt/core/SelectPrompt.ts): Interactive select user prompts in the terminal.
- [**TextPrompt**](./src/prompt/core/TextPrompt.ts): Interactive text user prompts in the terminal.
- [**TogglePrompt**](./src/prompt/core/TogglePrompt.ts): Interactive toggle user prompts in the terminal.
- [**createSearchPromptObject**](./src/prompt/additions/searchPrompt/core/createSearchPromptObject.ts): Create a search prompt object that can be run with `prompts()` from npm package: `prompts`. The point of this would be to run them in series. To run run a prompt directly, use
- [**getSearchPromptMetaData**](./src/prompt/additions/searchPrompt/core/getSearchPromptMetaData.ts): Retrieve the search prompt meta data associated with the given prompt object.
- [**initChoices**](./src/prompt/suggest/initChoices.ts): Initialize choices for a prompt by attaching meta data to each choice object.
- [**prompt**](libs/node/src/prompt.ts): Collection of factory functions for creating interactive terminal prompts.
- [**regExact**](./src/prompt/suggest/regExact.ts): Create a regular expression that matches the keyword exactly.
- [**regIncludes**](./src/prompt/suggest/regIncludes.ts): Create a regular expression that matches strings containing the keyword.
- [**regStartsWith**](./src/prompt/suggest/regStartsWith.ts): Create a regular expression that matches strings starting with the keyword.
- [**searchPrompt**](./src/prompt/additions/searchPrompt/searchPrompt.ts): Start a command-line prompt in which the user can search a provided list.
- [**suggestDefault**](./src/prompt/suggest/suggestDefault.ts): Default suggest function for autocomplete prompts. Filters and highlights choices based on user input.

<!-- EXPORTS_END -->

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
