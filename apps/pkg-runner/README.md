# pkg-runner

A CLI tool to run npm/yarn scripts with an interactive prompt to select which script(s) to run.

## Features

- **Interactive multi-select prompt** - Browse and select one or more scripts from your `package.json` with a searchable, scrollable list.
- **Fuzzy search with highlighting** - Type to filter scripts by name. Matching keywords are highlighted in the list. Supports multiple keywords (space-separated, AND logic) and alternation (`|` for OR logic).
- **Script preview as hints** - Each script's command is displayed as a hint next to its name, with automatic line-wrapping to fit the terminal width.
- **Auto-detects package manager** - Automatically uses `yarn` or `npm run` based on your `package.json` configuration.
- **Forward CLI arguments** - Any extra arguments passed to `pkg-runner` are forwarded to the selected scripts.
- **Keyboard shortcuts** - `Space` to toggle selection, `Ctrl+A` to select/deselect all filtered results, `Enter` to confirm (or select-and-confirm when nothing is selected).
- **Sequential execution** - Runs selected scripts one at a time, stopping on the first non-zero exit code.

## Installation

```sh
npm install -g pkg-runner
```

## Usage

Run `pkg-runner` (or `pr`) in any directory that contains a `package.json` with scripts:

```sh
pkg-runner
```

### Forward arguments to scripts

Any arguments after `pkg-runner` are forwarded to each selected script:

```sh
# Passes --watch to the selected script(s)
pkg-runner --watch
```

### Search and filter

Type in the prompt to filter scripts by name. The search supports:

- **Multiple keywords** - Space-separated terms are matched with AND logic (all must match).
- **Alternation** - Use `|` to match any of the given terms (OR logic).

### Keyboard shortcuts

| Key       | Action                                            |
| --------- | ------------------------------------------------- |
| `↑` / `↓` | Navigate the list                                 |
| `Space`   | Toggle selection of the focused item              |
| `Ctrl+A`  | Select or deselect all currently filtered items   |
| `Enter`   | Confirm selection (or select-and-confirm if none) |
| `Ctrl+C`  | Cancel and exit                                   |

## License

Released under the [MIT License](./LICENSE).
