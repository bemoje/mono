bemoje: Help me make a plan for how to solve this problem. It will be a very extensive manouvre. Should I make an action plan for how to do this?

## `s` dir

The scripts in the `s` are used in many places.

**Here is a search of: `node s/` in the codebase:**

package.json:
11 "scripts": {
12: "r": "node s/run.mjs",
13 "clean": "echo '\nCLEAN...' && yarn clean:fixOwnWsImports && yarn clean:indexts && yarn clean:ensureVitestImports && yarn clean:removeEmptyWsFiles && yarn clean:replaceBadDashChars",

15 "clean:indexts": "yarn workspaces foreach -Apt --verbose run indexts",
16: "clean:ensureVitestImports": "node s/clean/ensureVitestImports.mjs",
17: "clean:removeEmptyWsFiles": "node s/clean/removeEmptyWsFiles.mjs",
18 "build": "echo '\nBUILD...' && yarn workspaces foreach -Apt --verbose --exclude mono run build",
19: "clean:replaceBadDashChars": "node s/clean/replaceBadDashChars.mjs",
20 "insight": "echo '\nINSIGHT...' && yarn insight:knip && yarn insight:filesWithMissingCoverage && yarn insight:linesOfCode",
21: "insight:checkLibsTsDoc": "node s/insight/checkLibsTsDoc.mjs",
22: "insight:filesWithMissingCoverage": "echo 'Files with incomplete code coverage:' && node s/insight/filesWithMissingCoverage.mjs --check",
23 "insight:knip": "knip --config knip.jsonc --cache --no-config-hints",
24: "insight:linesOfCode": "node s/insight/linesOfCode.mjs",
25: "docs": "echo '\nDOCS...' && node s/docs/writeReadme.mjs",
26 "lint": "echo '\nLINT...' && eslint '{libs,apps,s}/\*_/_' --fix -c eslint.config.js --cache --ignore-pattern apps/playground",

35 "DK": "node .dist/devkit.cjs",
36: "ws": "node s/wsRun.mjs"
37 },

.github\prompts\ensure-code-coverage.prompt.md:
12
13: Get the files that do not have full code coverage: run `node s/insight/filesWithMissingCoverage.mjs`
14

18
19: Finally, when processing of all files is complete, run the tests with `yarn test-coverage` and then verify that all files have full code coverage by running `node s/insight/filesWithMissingCoverage.mjs` again and ensuring that no files are printed.

.vscode\tasks.json:
8 "type": "shell",
9: "command": "node s/run.mjs ${relativeFile}",
10 "args": [],

apps\playground\src\imports.ts:
98 })
99: .concat(...cp.execSync(`node s/insight/listLibsImportStatements.mjs`).toString().trim().split('\n'))
100

---

## devkit

Then we also have the `devkit` tool, which is a separate tool that has some overlap with the scripts in `s`.

The devkit even relies on scripts in the `s` dir, which is not ideal - especially because the `s` scripts also sometimes rely on `devkit`.

The devkit is supposed to be the only tool. The problem right now is that for some things I cannot fun devkit without certain dependencies, which are other workspaces within this repo.

So I can get myself in a situation where I cannot 'bootstrap' the repo because I need to run devkit to do it, but I cannot run devkit because I have not bootstrapped the repo - ie. I cannot build and run the devkit tool without first building and running the devkit tool.

So I will need to have built versions of the devkit and publish maybe to npm or something else.. And maintain versions so I can always use it even if the entire mono-repo is 'broken', ie. cannot build or whatever.

**Here is a search of: `devkit` in the package JSON files:**

6 results - 2 files

package.json:
13 "clean": "echo '\nCLEAN...' && yarn clean:fixOwnWsImports && yarn clean:indexts && yarn clean:ensureVitestImports && yarn clean:removeEmptyWsFiles && yarn clean:replaceBadDashChars",
14: "clean:fixOwnWsImports": "echo 'fixOwnWsImports...' && node .dist/devkit.cjs deps fix -f imports -y",
15 "clean:indexts": "yarn workspaces foreach -Apt --verbose run indexts",

33 "precommit": "echo '\nPRECOMMIT...' && yarn install && yarn clean && yarn typecheck && yarn lint && yarn build && yarn test-coverage && yarn insight && yarn docs && yarn format",
34: "dk": "yarn workspace devkit build && node .dist/devkit.cjs",
35: "DK": "node .dist/devkit.cjs",
36 "ws": "node s/wsRun.mjs"

apps\devkit\package.json:
1 {
2: "name": "devkit",
3 "description": "Development utilities for the monorepo.",

9 "build": "node esbuild.mjs",
10: "buildPackage": "node ../../s/util/buildcli.mjs devkit"
11 }

Yes, absolutely - this is a significant restructuring effort. I've audited the full scope of the problem. Here's a comprehensive action plan:

---

## Action Plan: Consolidate devkit and s into a single self-bootstrapping tool

### The Core Problems (summary from audit)

| Problem                 | Detail                                                                                                                                                                                                                 |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dual tooling**        | s scripts (13+ files) and devkit (CLI with 4 command groups) overlap and cross-reference each other                                                                                                                    |
| **Bootstrapping cycle** | devkit depends on 7 `@mono/*` packages (`monorepo`, `map`, `tscode`, `terminal`, `template`, `config`, `stacktrace`) which must be built first - but building them uses util scripts, and fixing the repo needs devkit |
| **Fragile wiring**      | Every lib's esbuild.mjs imports buildLibsWorkspace.mjs; every lib's package.json references indextsWs.mjs; root package.json mixes `node mono.` and `node .dist/devkit.cjs`                                            |
| **No fallback**         | If the repo is broken (can't build), there is no way to run devkit to fix it                                                                                                                                           |

---

### Phase 0: Preparation & Inventory

1. **Catalog all s scripts** and classify by purpose: build infrastructure, clean, insight, docs, debug, utility
2. **Catalog all devkit commands** and their `@mono/*` dependencies
3. **Map all consumers**: every package.json script, esbuild.mjs, .github, .vscode, and `playground` reference to s or devkit
4. **Identify what devkit actually needs** from each `@mono/*` package - determine if the functionality can be inlined or replaced with npm packages

### Phase 1: Eliminate devkit's `@mono/*` Dependencies

**Goal:** Devkit must build with **zero** workspace dependencies. It should only depend on npm packages and its own source code.

5. **Inline or replace `@mono/monorepo`** - this is the biggest dependency (used in deps, imports commands). Extract the needed classes (`MonoRepo`, `Workspace`, `getAllImports`, `resolveModuleImportPath`) directly into devkit's source
6. **Inline or replace `@mono/tscode`** - `tsExtractImports`, `tsSortImports` - copy into devkit
7. **Inline or replace `@mono/template`** - `Template`, `StringTemplateStrategy`, `JsonFileTemplateStrategy`, `TextFileTemplateStrategy` - copy into devkit
8. **Inline or replace `@mono/config`** - `ConfigFile` - copy into devkit
9. **Inline or replace `@mono/terminal`** - `confirmPrompt` - replace with a simple `readline` prompt or use `inquirer`
10. **Inline or replace `@mono/map`** - `ExtMap` - likely a small utility, inline it
11. **Replace `@mono/stacktrace`** - `enablePrettyStackTrace` - either inline or just drop it for the CLI tool

### Phase 2: Absorb s Scripts into devkit

**Goal:** All s functionality becomes devkit CLI subcommands.

12. **Absorb util shared functions** into devkit's internal lib (these are the foundation: `getRepoRootDirpath`, `buildFile`, `buildLibsWorkspace`, `getAllWorkspace*`, etc.)
13. **Absorb clean** → `devkit clean` subcommands:
    - `ensureVitestImports` → `devkit clean vitest-imports`
    - `indextsWs` → `devkit clean index-ts` (already per-workspace)
    - `removeEmptyWsFiles` → `devkit clean empty-files`
    - `replaceBadDashChars` → `devkit clean dash-chars`
14. **Absorb insight** → `devkit insight` subcommands:
    - `filesWithMissingCoverage` → `devkit insight coverage`
    - `linesOfCode` → `devkit insight loc`
    - `checkLibsTsDoc` → `devkit insight tsdoc`
    - `listLibsImportStatements` → `devkit insight import-statements`
    - `listLibsModules` → `devkit insight modules`
    - `depcheckUnused` → `devkit insight depcheck`
15. **Absorb docs** → `devkit docs` subcommand
16. **Absorb run.mjs** → `devkit run <file>` subcommand
17. **Absorb wsRun.mjs** → `devkit ws <workspace> <command>` subcommand
18. **Absorb npmPublishLibrary.mjs** → `devkit publish <lib>` subcommand
19. **Absorb debug** → `devkit debug reinstall` subcommand

### Phase 3: Solve the Bootstrap Problem

**Goal:** devkit must always be runnable, even if the repo is completely broken.

20. **Commit the built artifact** (devkit.cjs) to the repo - this means there's always a working copy available, even on fresh clone
21. **Add a CI step** that rebuilds devkit and checks that the committed devkit.cjs is up to date (to prevent it from getting stale)
22. **Alternative: Publish devkit to npm** as `@bemoje/devkit` - then you can always `npx @bemoje/devkit` regardless of repo state. More robust but adds npm publish overhead

> **Recommendation**: Do **both** - commit the artifact for instant availability, and consider npm publish as a future option.

### Phase 4: Update All Consumers

23. **Update every lib's esbuild.mjs** - replace `import { buildLibsWorkspace } from buildLibsWorkspace.mjs'` with either:
    - a devkit CLI call: `devkit build <workspace>`, or
    - keep a minimal standalone esbuild.mjs wrapper that calls the now-built-in devkit function
24. **Update every lib's package.json** - replace `"indexts": "node ../../s/clean/indextsWs.mjs"` with `node devkit.cjs clean index-ts`
25. **Update root package.json scripts** - replace all `node mono.` and `node devkit.cjs ...` references with unified `node devkit.cjs <command>` calls
26. **Update tasks.json** - change run command
27. **Update .github prompts** - update references to old script paths
28. **Update playground** - the `imports.ts` file that shells out to `node s/insight/listLibsImportStatements.mjs`

### Phase 5: Delete s Directory & Clean Up

29. **Delete the s directory entirely**
30. **Remove s from workspace and eslint config references**
31. **Update devkit.config.json** - remove any stale s references (e.g., `"indexts": "node ../../s/clean/indextsWs.mjs"` in templates)
32. **Update README** and documentation

### Phase 6: Validation & Testing

33. **Fresh clone test** - clone the repo, run `node .dist/devkit.cjs` to verify it works without building
34. **Build test** - run `yarn dk` to rebuild devkit, verify it still works
35. **Full `precommit` pipeline** - run the entire clean → typecheck → lint → build → test → insight → docs → format cycle
36. **Test each migrated command** individually

---

### Suggested Execution Order & Risk Notes

| Priority                  | Why                                                                                        |
| ------------------------- | ------------------------------------------------------------------------------------------ |
| **Phase 1 first**         | Until devkit has zero `@mono/*` deps, you can't solve the bootstrap problem                |
| **Phase 3 early**         | Committing the built artifact is quick and gives you a safety net for the rest of the work |
| **Phase 2 incrementally** | Migrate one s script at a time, update its consumers (Phase 4), test, repeat               |
| **Phase 5 last**          | Only delete s after everything is migrated and validated                                   |

The riskiest part is **Phase 1** (inlining `@mono/*` dependencies). The `@mono/monorepo` package is likely the largest - I'd start by understanding exactly how much of it devkit actually uses, and inline only the needed functions.
