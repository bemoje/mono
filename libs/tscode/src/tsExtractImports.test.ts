import { describe, expect, it } from 'vitest'
import { tsExtractImports } from './tsExtractImports'
import { ITsExtractImportsResult } from './ITsExtractImportsResult'

describe(tsExtractImports.name, () => {
  it('should return an empty array for an empty code string', () => {
    const code = ''
    const result = tsExtractImports(code)
    expect(result).toEqual([])
  })

  it('should correctly extract a single import statement without braces', () => {
    const code = "import { module } from 'module'"
    const result: ITsExtractImportsResult[] = [
      {
        start: 0,
        end: 1,
        match: "import { module } from 'module'",
        matchOneLine: "import { module } from 'module'",
      },
    ]
    expect(tsExtractImports(code)).toEqual(result)
  })

  it('should correctly extract a single import statement with braces', () => {
    const code = "import module from 'module'"
    const result: ITsExtractImportsResult[] = [
      { start: 0, end: 1, match: "import module from 'module'", matchOneLine: "import module from 'module'" },
    ]
    expect(tsExtractImports(code)).toEqual(result)
  })

  it('should correctly handle multi-line imports', () => {
    const code = "import {\n  module3,\n  module4\n} from 'module3'"
    const result: ITsExtractImportsResult[] = [
      {
        start: 0,
        end: 4,
        match: "import {\n  module3,\n  module4\n} from 'module3'",
        matchOneLine: "import { module3, module4 } from 'module3'",
      },
    ]
    expect(tsExtractImports(code)).toEqual(result)
  })

  it('should correctly extract multiple import statements', () => {
    const code = [
      "import { module1 } from 'module1'",
      "import module2 from 'module2'",
      "import { module3, module4 } from 'module3'",
    ].join('\n')
    const result: ITsExtractImportsResult[] = [
      {
        start: 0,
        end: 1,
        match: "import { module1 } from 'module1'",
        matchOneLine: "import { module1 } from 'module1'",
      },
      { start: 1, end: 2, match: "import module2 from 'module2'", matchOneLine: "import module2 from 'module2'" },
      {
        start: 2,
        end: 3,
        match: "import { module3, module4 } from 'module3'",
        matchOneLine: "import { module3, module4 } from 'module3'",
      },
    ]
    expect(tsExtractImports(code)).toEqual(result)
  })
})
