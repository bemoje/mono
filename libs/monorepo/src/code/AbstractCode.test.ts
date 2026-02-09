import { describe, expect, it } from 'vitest'
import { AbstractCode } from './AbstractCode'
import { TsCode } from './TsCode'

function createTsCode(code: string) {
  return new TsCode({} as any, code)
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
