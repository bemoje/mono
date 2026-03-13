---
'linkedin-resume': major
'@mono/composition': major
'pkg-runner': major
'playground': major
'@mono/decorators': major
'@mono/stacktrace': major
'@mono/monorepo': major
'@mono/profiler': major
'@mono/template': major
'@mono/terminal': major
'@mono/tschema': major
'devkit': major
'@mono/config': major
'@mono/crypto': major
'@mono/eslint': major
'@mono/number': major
'@mono/object': major
'@mono/prompt': major
'@mono/string': major
'@mono/tscode': major
'@mono/array': major
'@mono/queue': major
'@mono/regex': major
'@mono/table': major
'@mono/types': major
'@mono/date': major
'@mono/iter': major
'@mono/node': major
'@mono/path': major
'@mono/cli': major
'@mono/map': major
'@mono/fn': major
'@mono/fs': major
'@mono/is': major
'@mono/os': major
---

This is the initial major release batch for the @bemoje/mono workspace.

- **Build & CI Overhaul:** Introduced hash-based build caching, updated Turbo configurations, integrated Publint / @arethetypeswrong/cli into the build pipeline, and refined test-coverage workflows.
- **CLI Framework:** Major refactoring of `@mono/cli` providing unified API, robust hooks, validation, and subcommands. Updated `devkit` inner CLI to utilize the new toolset.
- **Utilities & Libraries Update:** Migrated several utilities to `es-toolkit`, expanded typescript utilities (`AllKeys`, `CommonKeys`), added new async dependency queues, and expanded `@mono/monorepo` functionality.
- **Code Quality:** Enforced stricter ESLint configurations, introduced `eslint-plugin-unicorn`, configured import splitting rules, and added pre-commit hooks via `lint-staged`.
- **Apps:** Major updates to `linkedin-resume` introducing Markdown resume generation formats and interactive login flows. Implemented interactive clack prompts in `pkg-runner`.
