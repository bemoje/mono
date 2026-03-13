# Todos

## libs/cli

### ensureThat

In `libs/cli/src/lib/helpers` dir, see this example:

```ts
export function assertAddRequiredArgumentAllowed(cmd: ICommand): void {
  ensureThat(cmd, [hasNoVariadicArguments, hasNoOptionalArguments], {
    message: 'Adding required argument not allowed after variadic or optional arguments.',
  })
}
```

Do the same thing for the remaining 'assert' functions in that dir.

### publish

finish up `libs/cli` Compare with `~/repos/tsmono` and take any good stuff from there.

Publish to npm. Find a good name.

---

## libs/stacktrace

### bin

Continue work on `libs/stacktrace/bin/enablePrettyStackTrace.cjs`

Should be possible to set it up so you can require it with no like `-r @mono/stacktrace/enablePrettyStackTrace` and it will enable the pretty stack trace globally for the process. This will be useful for the CLI and other tools.

---

## .vscode

### keybinds

Set up keybinds, eg. add selection to chat, etc.

## ~/repos/.dist

### trnasfer good stuff

Find good stuff in .dist and convert it to fit into repos/mono

**ts.ps1** check out, eg. `C:/Users/bemoj/repos/.dist/ts.ps1`

```bash
tsx -r tsconfig-paths/register -r dotenv/config -r source-map-support/register -r ./scripts/enablePrettyStackTrace.cjs @args
```
