import * as vitest from 'vitest'
import { RuleTester } from '@typescript-eslint/rule-tester'
import { splitImports } from './splitImports'

RuleTester.afterAll = vitest.afterAll
RuleTester.it = vitest.it
RuleTester.itOnly = vitest.it.only
RuleTester.describe = vitest.describe

const ruleTester = new RuleTester()

ruleTester.run('split-imports', splitImports, {
  valid: [
    { name: 'single named import', code: `import { a } from "mod";` },
    { name: 'single default import', code: `import a from "mod";` },
    { name: 'single type import declaration', code: `import type { A } from "mod";` },
    { name: 'already split imports', code: [`import a from "mod";`, `import { b } from "mod";`].join('\n') },
  ],

  invalid: [
    {
      name: 'split named imports',
      code: `import { a, b } from "mod";`,
      errors: [{ messageId: 'split-import' }],
      output: [`import { a } from "mod";`, `import { b } from "mod";`].join('\n'),
    },
    {
      name: 'split default and named import',
      code: `import a, { b } from "mod";`,
      errors: [{ messageId: 'split-import' }],
      output: [`import a from "mod";`, `import { b } from "mod";`].join('\n'),
    },
    {
      name: 'split default and namespace import',
      code: `import a, * as ns from "mod";`,
      errors: [{ messageId: 'split-import' }],
      output: [`import a from "mod";`, `import * as ns from "mod";`].join('\n'),
    },
    {
      name: 'split type modifiers inside braces',
      code: `import { type A, B } from "mod";`,
      errors: [{ messageId: 'split-import' }],
      output: [`import type A from "mod";`, `import { B } from "mod";`].join('\n'),
    },
    {
      name: 'split import type declaration',
      code: `import type { A, B } from "mod";`,
      errors: [{ messageId: 'split-import' }],
      output: [`import type { A } from "mod";`, `import type { B } from "mod";`].join('\n'),
    },
  ],
})
