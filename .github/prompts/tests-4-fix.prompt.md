---
mode: 'agent'
tools: ['codebase', 'findTestFiles','usages','testFailure'],
description: 'Fix failing tests.'
---

## Extends

Prepend and apply the:

- [test generation instructions](.github/copilot/instructions/testGeneration.instructions.md).

## Instructions

Please fix the tests that failed.
If there are problems in the source code, stop and explain the problem in the chat, but do not change the source code without confirmation.
