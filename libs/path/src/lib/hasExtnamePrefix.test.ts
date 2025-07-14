import { describe, it, expect } from 'vitest'
import assert from 'node:assert'
import { hasExtnamePrefix } from './hasExtnamePrefix'

describe(hasExtnamePrefix.name, () => {
  it('examples', () => {
    expect(() => {
      // Check if TypeScript files have semantic prefixes
      assert.deepStrictEqual(hasExtnamePrefix('Button.test.ts'), true, 'should match test prefix')
      assert.deepStrictEqual(hasExtnamePrefix('utils.spec.js'), true, 'should match spec prefix')
      assert.deepStrictEqual(hasExtnamePrefix('types.d.ts'), true, 'should match d prefix')
      assert.deepStrictEqual(hasExtnamePrefix('component.tsx'), false, 'should not match without prefix')
    }).not.toThrow()
  })

  describe('Default semantic prefixes', () => {
    it('should match files with test prefix', () => {
      expect(hasExtnamePrefix('Button.test.ts')).toBe(true)
      expect(hasExtnamePrefix('utils.test.js')).toBe(true)
      expect(hasExtnamePrefix('path/to/file.test.tsx')).toBe(true)
    })

    it('should match files with spec prefix', () => {
      expect(hasExtnamePrefix('Button.spec.ts')).toBe(true)
      expect(hasExtnamePrefix('utils.spec.js')).toBe(true)
      expect(hasExtnamePrefix('path/to/file.spec.tsx')).toBe(true)
    })

    it('should match files with d prefix (type definitions)', () => {
      expect(hasExtnamePrefix('types.d.ts')).toBe(true)
      expect(hasExtnamePrefix('global.d.ts')).toBe(true)
      expect(hasExtnamePrefix('path/to/custom.d.ts')).toBe(true)
    })

    it('should match files with other semantic prefixes', () => {
      expect(hasExtnamePrefix('demo.examples.ts')).toBe(true)
      expect(hasExtnamePrefix('perf.benchmark.js')).toBe(true)
      expect(hasExtnamePrefix('scratch.temp.ts')).toBe(true)
      expect(hasExtnamePrefix('legacy.old.js')).toBe(true)
      expect(hasExtnamePrefix('feature.wip.ts')).toBe(true)
    })

    it('should not match files without semantic prefixes', () => {
      expect(hasExtnamePrefix('Button.tsx')).toBe(false)
      expect(hasExtnamePrefix('utils.js')).toBe(false)
      expect(hasExtnamePrefix('index.ts')).toBe(false)
      expect(hasExtnamePrefix('component.css')).toBe(false)
    })

    it('should not match files with invalid prefixes', () => {
      expect(hasExtnamePrefix('file.invalid.ts')).toBe(false)
      expect(hasExtnamePrefix('file.custom.js')).toBe(false)
      expect(hasExtnamePrefix('file.random.tsx')).toBe(false)
    })
  })

  describe('Specific semantic prefixes', () => {
    it('should match files with single specific prefix', () => {
      expect(hasExtnamePrefix('file.test.ts', 'test')).toBe(true)
      expect(hasExtnamePrefix('utils.spec.js', 'spec')).toBe(true)
      expect(hasExtnamePrefix('types.d.ts', 'd')).toBe(true)
    })

    it('should match files with array of specific prefixes', () => {
      expect(hasExtnamePrefix('file.test.ts', ['test', 'spec'])).toBe(true)
      expect(hasExtnamePrefix('file.spec.js', ['test', 'spec'])).toBe(true)
      expect(hasExtnamePrefix('file.d.ts', ['d', 'examples'])).toBe(true)
      expect(hasExtnamePrefix('file.benchmark.ts', ['test', 'spec'])).toBe(false)
    })

    it('should not match files when specific prefix not found', () => {
      expect(hasExtnamePrefix('file.test.ts', 'spec')).toBe(false)
      expect(hasExtnamePrefix('file.spec.js', ['d', 'examples'])).toBe(false)
    })
  })

  describe('Path handling', () => {
    it('should work with full paths', () => {
      expect(hasExtnamePrefix('/path/to/file.test.ts')).toBe(true)
      expect(hasExtnamePrefix('C:\\\\path\\\\to\\\\file.spec.js')).toBe(true)
      expect(hasExtnamePrefix('./relative/path/file.d.ts')).toBe(true)
    })

    it('should work with different file extensions', () => {
      expect(hasExtnamePrefix('file.test.tsx')).toBe(true)
      expect(hasExtnamePrefix('file.spec.jsx')).toBe(true)
      expect(hasExtnamePrefix('file.d.mts')).toBe(true)
      expect(hasExtnamePrefix('file.test.mjs')).toBe(true)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      expect(hasExtnamePrefix('')).toBe(false)
      expect(hasExtnamePrefix('', 'test')).toBe(false)
    })

    it('should handle files with multiple dots', () => {
      expect(hasExtnamePrefix('file.name.test.ts')).toBe(true)
      expect(hasExtnamePrefix('my.component.spec.tsx')).toBe(true)
      expect(hasExtnamePrefix('util.helper.d.ts')).toBe(true)
    })

    it('should be case sensitive', () => {
      expect(hasExtnamePrefix('file.TEST.ts')).toBe(false)
      expect(hasExtnamePrefix('file.Test.js')).toBe(false)
      expect(hasExtnamePrefix('file.SPEC.tsx')).toBe(false)
    })
  })
})
