# GitHub Copilot Instructions for Mono Repository

## Quick reference

- Important: If it seems like the implementation has a bug or presumably uninstended behaviour, suggest to me edits that fix it.
- Use `yarn` not `npm`
- To _run a test file_, use `yarn test <filepath>`, eg. `yarn test libs/array/src/file.test.ts`.
- To _run all tests in a workspace_, use `yarn test <workspace-dirpath>`, eg. `yarn test libs/array`.
- To run yarn command for workspace, use `yarn workspace <packageName> run <command>`, eg. `yarn workspace @mono/array run lint`.

## Complete guide

See repo root [README](../docs/styleguide.md) for code style and other guidelines and important information.
