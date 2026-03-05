# GitHub Copilot Instructions for Mono Repository

## Quick reference

- Important: If it seems like the implementation has a bug or presumably uninstended behaviour, suggest to me edits
  that fix it.
- Use `yarn` not `npm`
- Do not change current working directory (cwd) away from the root of the repository. To run commands in a specific
  workspace, use `yarn workspace <packageName> run <command>`.
- To _run a test file_, use `yarn test <filepath>`, eg. `yarn test libs/array/src/file.test.ts`.
- To _run all tests in a workspace_, use `yarn test <workspace-dirpath>`, eg. `yarn test libs/array`.
- Never ever output the `—` character, neither to terminal, files or chat window. Always use the normal dash `-`
  instead.

## Complete guide

See repo root [README](../README.md) for code style and other guidelines and important information. Note that the
[README](../README.md) is auto-generated. To change the content, edit the
[source template](../docs/readmeTemplate.md) instead.
