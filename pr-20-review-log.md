# PR #20 Review Fix Log

> Branch: `20260218-linkedin-resume`
> Started: 2026-02-18
> Plan: see `pr-20-review-plan.md`

---

## Progress
### Issue #1: Environment variable expansion - DONE
- Commit: `947a823`
- Created `apps/linkedin-resume/src/utils/expandEnvVars.ts`
- Applied in `renderPdfFromHtml.ts` to expand `$VAR`/`${VAR}` in output filepath

### Issue #2: Null crash LinkedIn profile - DONE
- Commit: `341952b`
- Changed `renderResumeHtml.ts` to use case-insensitive `.find()` and optional chaining

### Issue #3: Typo CHROME_PPROFILE_PATH - DONE
- Commit: `770b963`
- Renamed to `CHROME_PROFILE_PATH` in `constants.ts`, `scrapeLinkedIn.ts`, `ensureUserLoggedInToLinkedIn.ts`

### Issue #4: devkit version bump - DONE
- Commit: `f159b84`
- Updated root `package.json` `@bemoje/devkit` from `0.0.12` to `0.0.13`, ran `yarn install`

### Issues #5-6: README fixes - DONE
- Commit: `e6a9cf5`
- Fixed headless examples (default is headless, `--no-headless` shows browser)
- Changed invalid `false` values to `true` in ignore config example

### Issue #7: Publish scripts pattern - DONE
- Commit: `7bf4f0e`
- Replaced `cd` chaining with `yarn workspace` commands

### Issue #8: esbuild var rename - DONE
- Commit: `a15f721`
- Renamed `packageJsonDirpath` to `packageJsonFilepath` in both esbuild.mjs files

### Issue #9: Browser helper dedup - DONE
- Commit: `8d7a34f`
- Created `injectBrowserHelpers.ts` utility
- Removed inline `getTextWithBreaks`/`getVisibleSpans` from 5 scraper files
- Each scraper now calls `injectBrowserHelpers(page)` and references `globalThis.__getVisibleSpans`

### Issue #10: parseDate dedup - DONE
- Commit: `e462e47`
- Refactored `scrapeEducation.ts` to import shared `parseDate` utility

### Issue #11: Dead code removal - DONE
- Commit: `8340ea9`
- Removed `options.headless = options.headless ?? true` from `main.ts`

### Issue #12: fs.exists fix - DONE
- Commit: `41d7498`
- Replaced `fs.exists` and `fs.existsSync` with `fs.pathExists` in `renderPdfFromHtml.ts`

### Issue #13: Trailing newline JSON - DONE
- Commit: `0244b11`
- Added `+ '\n'` to `JsonFileStrategy.save`

### Issue #14: PickPrimitive test - DONE
- Commit: `819a7ec`
- Created `libs/types/src/PickPrimitive.test.ts` with compile-time assertions (passes)

### Issue #15: Escape single quotes - DONE
- Commit: `4b129fb`
- Added `' -> &#39;` to `esc()` in `renderResumeHtml.ts`

---

## Summary

All 15 issues from `pr-20-review-plan.md` have been resolved. 14 commits total (issues #5 and #6 were combined into one commit).