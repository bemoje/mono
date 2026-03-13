# @mono/queue

## 1.0.0

### Major Changes

- e3937a4: This is the initial major release batch for the @bemoje/mono workspace.
  - **Build & CI Overhaul:** Introduced hash-based build caching, updated Turbo configurations, integrated Publint / @arethetypeswrong/cli into the build pipeline, and refined test-coverage workflows.
  - **CLI Framework:** Major refactoring of `@mono/cli` providing unified API, robust hooks, validation, and subcommands. Updated `devkit` inner CLI to utilize the new toolset.
  - **Utilities & Libraries Update:** Migrated several utilities to `es-toolkit`, expanded typescript utilities (`AllKeys`, `CommonKeys`), added new async dependency queues, and expanded `@mono/monorepo` functionality.
  - **Code Quality:** Enforced stricter ESLint configurations, introduced `eslint-plugin-unicorn`, configured import splitting rules, and added pre-commit hooks via `lint-staged`.
  - **Apps:** Major updates to `linkedin-resume` introducing Markdown resume generation formats and interactive login flows. Implemented interactive clack prompts in `pkg-runner`.
