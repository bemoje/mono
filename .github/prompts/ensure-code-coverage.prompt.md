---
mode: agent
description: Finds and fixes gaps in code coverage by identifying files with missing coverage and creating tasks to address them.
tools: ['edit', 'search', 'runCommands', 'usages', 'think', 'problems', 'testFailure', 'todos', 'runTests']
---

## General Instructions

- if uncovered source code is dead code or code that cannot be reached without type violations, then if it makes sense, refactor the source code so that unreachable code is removed.

## Tasks

Get the files that do not have full code coverage: run `node s/insight/filesWithMissingCoverage.mjs`

Create a todo for each of the printed filepaths to ensure full code coverage using the #todos tool

process only one file at a time.
