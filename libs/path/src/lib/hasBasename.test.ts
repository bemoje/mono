import { describe, it, expect } from 'vitest'
import assert from 'node:assert'
import { hasBasename } from './hasBasename'

describe(hasBasename.name, () => {
  it('examples', () => {
    expect(() => {
      // Check if files have specific basenames
      assert.deepStrictEqual(hasBasename('path/to/index.ts', 'index.ts'), true, 'should match single basename')
      assert.deepStrictEqual(
        hasBasename('src/main.js', ['index.js', 'main.js']),
        true,
        'should match array of basenames',
      )
      assert.deepStrictEqual(
        hasBasename('utils/helper.ts', ['index.ts', 'main.ts']),
        false,
        'should not match unincluded basename',
      )
    }).not.toThrow()
  })

  describe('Single basename matching', () => {
    it('should match files with the specified basename', () => {
      expect(hasBasename('src/index.ts', 'index.ts')).toBe(true)
      expect(hasBasename('components/Button.tsx', 'Button.tsx')).toBe(true)
      expect(hasBasename('utils/helper.js', 'helper.js')).toBe(true)
      expect(hasBasename('config.json', 'config.json')).toBe(true)
    })

    it('should not match files with different basenames', () => {
      expect(hasBasename('src/index.ts', 'main.ts')).toBe(false)
      expect(hasBasename('components/Button.tsx', 'Input.tsx')).toBe(false)
      expect(hasBasename('utils/helper.js', 'util.js')).toBe(false)
    })

    it('should work with different path formats', () => {
      expect(hasBasename('src/index.ts', 'index.ts')).toBe(true)
      expect(hasBasename('src\\\\index.ts', 'index.ts')).toBe(true)
      expect(hasBasename('/home/user/project/index.ts', 'index.ts')).toBe(true)
      expect(hasBasename('C:\\\\path\\\\to\\\\index.ts', 'index.ts')).toBe(true)
    })
  })

  describe('Multiple basenames matching', () => {
    it('should match files with any of the specified basenames', () => {
      expect(hasBasename('src/index.ts', ['index.ts', 'main.ts', 'app.ts'])).toBe(true)
      expect(hasBasename('src/main.ts', ['index.ts', 'main.ts', 'app.ts'])).toBe(true)
      expect(hasBasename('src/app.ts', ['index.ts', 'main.ts', 'app.ts'])).toBe(true)
    })

    it('should not match files with basenames not in the list', () => {
      expect(hasBasename('src/helper.ts', ['index.ts', 'main.ts', 'app.ts'])).toBe(false)
      expect(hasBasename('components/Button.tsx', ['index.tsx', 'main.tsx'])).toBe(false)
      expect(hasBasename('utils/util.js', ['helper.js', 'common.js'])).toBe(false)
    })
  })

  describe('Common filename patterns', () => {
    it('should match common configuration files', () => {
      expect(hasBasename('package.json', 'package.json')).toBe(true)
      expect(hasBasename('tsconfig.json', 'tsconfig.json')).toBe(true)
      expect(hasBasename('.gitignore', '.gitignore')).toBe(true)
      expect(hasBasename('README.md', 'README.md')).toBe(true)
    })

    it('should match common entry point files', () => {
      const entryPoints = ['index.js', 'index.ts', 'main.js', 'main.ts', 'app.js', 'app.ts']
      expect(hasBasename('src/index.js', entryPoints)).toBe(true)
      expect(hasBasename('src/index.ts', entryPoints)).toBe(true)
      expect(hasBasename('src/main.js', entryPoints)).toBe(true)
      expect(hasBasename('src/main.ts', entryPoints)).toBe(true)
      expect(hasBasename('src/app.js', entryPoints)).toBe(true)
      expect(hasBasename('src/app.ts', entryPoints)).toBe(true)
      expect(hasBasename('src/helper.ts', entryPoints)).toBe(false)
    })

    it('should match test files', () => {
      const testFiles = ['test.js', 'spec.js', 'test.ts', 'spec.ts']
      expect(hasBasename('src/test.js', testFiles)).toBe(true)
      expect(hasBasename('src/spec.ts', testFiles)).toBe(true)
      expect(hasBasename('src/component.ts', testFiles)).toBe(false)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      expect(hasBasename('', 'index.ts')).toBe(false)
      expect(hasBasename('src/index.ts', '')).toBe(false)
    })

    it('should handle files without paths', () => {
      expect(hasBasename('index.ts', 'index.ts')).toBe(true)
      expect(hasBasename('README.md', 'README.md')).toBe(true)
      expect(hasBasename('package.json', 'package.json')).toBe(true)
    })

    it('should be case sensitive', () => {
      expect(hasBasename('src/Index.ts', 'index.ts')).toBe(false)
      expect(hasBasename('src/INDEX.TS', 'index.ts')).toBe(false)
      expect(hasBasename('src/Main.js', 'main.js')).toBe(false)
    })

    it('should handle empty basename arrays', () => {
      expect(hasBasename('src/index.ts', [])).toBe(false)
    })

    it('should handle complex filenames', () => {
      expect(hasBasename('src/my-component.test.tsx', 'my-component.test.tsx')).toBe(true)
      expect(hasBasename('lib/utils.d.ts', 'utils.d.ts')).toBe(true)
      expect(hasBasename('dist/bundle.min.js', 'bundle.min.js')).toBe(true)
    })

    it('should not match partial basenames', () => {
      expect(hasBasename('src/index.ts', 'index')).toBe(false)
      expect(hasBasename('src/index.ts', 'dex.ts')).toBe(false)
      expect(hasBasename('src/helper.js', 'help')).toBe(false)
    })
  })
})
