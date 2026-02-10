import { describe, expect, it } from 'vitest'
import { AbstractCode } from './AbstractCode'
import { TsCode } from './TsCode'

function createTsCode(code: string) {
  return new TsCode({} as any, code)
}

class ConcreteCode extends AbstractCode {
  #code: string
  constructor(code: string) {
    super({} as any)
    this.#code = code
  }
  toString() {
    return this.#code
  }
}

describe(AbstractCode.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(AbstractCode.inspector).toBeDefined()
    })
  })

  describe('path', () => {
    it('should throw when no File ancestor exists', () => {
      const tsCode = createTsCode('const a = 1')
      expect(() => tsCode.path).toThrow()
    })
  })

  describe('code', () => {
    it('should return the string representation via toString()', () => {
      const code = new ConcreteCode('const a = 1')
      expect(code.code).toBe('const a = 1')
    })
  })

  describe('isMultiLine', () => {
    it('should return false for single-line code', () => {
      const tsCode = createTsCode('const a = 1')
      expect(tsCode.isMultiLine).toBe(false)
    })

    it('should return true for multi-line code', () => {
      const tsCode = createTsCode('const a = 1\nconst b = 2')
      expect(tsCode.isMultiLine).toBe(true)
    })
  })

  describe('lines', () => {
    it('should return an array of lines', () => {
      const tsCode = createTsCode('line1\nline2\nline3')
      expect(tsCode.lines).toEqual(['line1', 'line2', 'line3'])
    })
  })

  describe('codeIndexRangeOf', () => {
    it('should return the index range of a code substring', () => {
      const tsCode = createTsCode('const a = 1')
      const range = tsCode.codeIndexRangeOf('a = 1')
      expect(range).toEqual({ index: 6, lastIndex: 11 })
    })

    it('should throw when code is not found', () => {
      const tsCode = createTsCode('const a = 1')
      expect(() => tsCode.codeIndexRangeOf('not found')).toThrow('Code not found')
    })
  })

  describe('getCodeRange', () => {
    it('should return the code within the given range', () => {
      const tsCode = createTsCode('const a = 1')
      const range = { index: 6, lastIndex: 11 }
      expect(tsCode.getCodeRange(range)).toBe('a = 1')
    })
  })

  describe('codePreview', () => {
    it('should return the full code for a single-line string', () => {
      const tsCode = createTsCode('const a = 1')
      expect(tsCode.codePreview).toBe('const a = 1')
    })

    it('should truncate long single lines', () => {
      const longLine = 'a'.repeat(200)
      const tsCode = createTsCode(longLine)
      const preview = tsCode.codePreview as string
      expect(preview.length).toBe(AbstractCode.codePreviewOptions.maxLineLength)
      expect(preview.endsWith('...')).toBe(true)
    })

    it('should return an array for multi-line code', () => {
      const lines = Array.from({ length: 20 }, (_, i) => `line ${i + 1}`)
      const tsCode = createTsCode(lines.join('\n'))
      const preview = tsCode.codePreview as string[]
      expect(Array.isArray(preview)).toBe(true)
      expect(preview.length).toBe(AbstractCode.codePreviewOptions.maxLines)
    })

    it('should truncate long lines in multi-line code', () => {
      const longLine = 'b'.repeat(200)
      const tsCode = createTsCode(`short line\n${longLine}`)
      const preview = tsCode.codePreview as string[]
      expect(preview[0]).toBe('short line')
      expect(preview[1].endsWith('...')).toBe(true)
    })
  })
})
