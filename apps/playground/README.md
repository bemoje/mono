# playground

Scratch workspace for experimentation, prototyping, and ad-hoc development tasks.

This is a **private** workspace (not published to npm). It is excluded from tests, linting, and builds.

## Purpose

- Try out new libraries or APIs before integrating them into libs
- Prototype CLI tools, class designs, or utility functions
- Run one-off scripts and experiments

## Conventions

- Files use semantic prefixes (`.temp.ts`, `.examples.ts`) to indicate their nature
- No production code should live here - move stable code to the appropriate `libs/` package
- The workspace is excluded from CI checks and coverage reports
