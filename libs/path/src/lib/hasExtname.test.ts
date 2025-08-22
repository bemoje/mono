import { describe, it, expect } from 'vitest'
import assert from 'node:assert'
import { hasExtname } from './hasExtname'

describe(hasExtname.name, () => {
  it('examples', () => {
    expect(() => {
      // Check if files have specific extensions
      assert.deepStrictEqual(hasExtname('file.ts', 'ts'), true, 'should match single extension')
      assert.deepStrictEqual(hasExtname('file.js', ['js', 'ts']), true, 'should match array of extensions')
      assert.deepStrictEqual(hasExtname('file.txt', ['js', 'ts']), false, 'should not match unincluded extension')
    }).not.toThrow()
  })

  describe('Single extension matching', () => {
    it('should match files with the specified extension', () => {
      expect(hasExtname('file.ts', 'ts')).toBe(true)
      expect(hasExtname('component.tsx', 'tsx')).toBe(true)
      expect(hasExtname('script.js', 'js')).toBe(true)
      expect(hasExtname('data.json', 'json')).toBe(true)
    })

    it('should not match files with different extensions', () => {
      expect(hasExtname('file.ts', 'js')).toBe(false)
      expect(hasExtname('component.tsx', 'ts')).toBe(false)
      expect(hasExtname('script.js', 'tsx')).toBe(false)
    })

    it('should work with paths', () => {
      expect(hasExtname('src/components/Button.tsx', 'tsx')).toBe(true)
      expect(hasExtname('/home/user/project/file.ts', 'ts')).toBe(true)
      expect(hasExtname('C:\\\\path\\\\to\\\\file.js', 'js')).toBe(true)
    })
  })

  describe('Multiple extensions matching', () => {
    it('should match files with any of the specified extensions', () => {
      expect(hasExtname('file.ts', ['js', 'ts', 'tsx'])).toBe(true)
      expect(hasExtname('file.js', ['js', 'ts', 'tsx'])).toBe(true)
      expect(hasExtname('file.tsx', ['js', 'ts', 'tsx'])).toBe(true)
      expect(hasExtname('file.json', ['json', 'yaml'])).toBe(true)
    })

    it('should not match files with extensions not in the list', () => {
      expect(hasExtname('file.py', ['js', 'ts', 'tsx'])).toBe(false)
      expect(hasExtname('file.txt', ['json', 'yaml'])).toBe(false)
      expect(hasExtname('file.css', ['js', 'ts'])).toBe(false)
    })
  })

  describe('Predefined extension methods', () => {
    it('should have js method for JavaScript files', () => {
      expect(hasExtname.js('file.js')).toBe(true)
      expect(hasExtname.js('file.mjs')).toBe(true)
      expect(hasExtname.js('file.jsx')).toBe(true)
      expect(hasExtname.js('file.cjs')).toBe(true)
      expect(hasExtname.js('file.ts')).toBe(false)
    })

    it('should have json method for JSON files', () => {
      expect(hasExtname.json('config.json')).toBe(true)
      expect(hasExtname.json('tsconfig.jsonc')).toBe(true)
      expect(hasExtname.json('file.js')).toBe(false)
    })

    it('should have yaml method for YAML files', () => {
      expect(hasExtname.yaml('config.yaml')).toBe(true)
      expect(hasExtname.yaml('docker-compose.yml')).toBe(true)
      expect(hasExtname.yaml('file.json')).toBe(false)
    })

    it('should have markdown method for Markdown files', () => {
      expect(hasExtname.markdown('README.md')).toBe(true)
      expect(hasExtname.markdown('CHANGELOG.markdown')).toBe(true)
      expect(hasExtname.markdown('file.txt')).toBe(false)
    })

    it('should have ts method for TypeScript files', () => {
      expect(hasExtname.ts('file.ts')).toBe(true)
      expect(hasExtname.ts('file.mts')).toBe(true)
      expect(hasExtname.ts('file.tsx')).toBe(true)
      expect(hasExtname.ts('file.js')).toBe(false)
    })
  })

  describe('Edge cases', () => {
    it('should handle empty strings', () => {
      expect(hasExtname('', 'ts')).toBe(false)
      expect(hasExtname('file.ts', '')).toBe(false)
    })

    it('should handle files without extensions', () => {
      expect(hasExtname('README', 'md')).toBe(false)
      expect(hasExtname('Dockerfile', 'txt')).toBe(false)
    })

    it('should handle files with multiple dots', () => {
      expect(hasExtname('file.min.js', 'js')).toBe(true)
      expect(hasExtname('types.d.ts', 'ts')).toBe(true)
      expect(hasExtname('component.test.tsx', 'tsx')).toBe(true)
    })

    it('should be case sensitive', () => {
      expect(hasExtname('file.TS', 'ts')).toBe(false)
      expect(hasExtname('file.JS', 'js')).toBe(false)
      expect(hasExtname('file.JSON', 'json')).toBe(false)
    })

    it('should handle empty extension arrays', () => {
      expect(hasExtname('file.ts', [])).toBe(false)
    })

    it('should not match partial extensions', () => {
      expect(hasExtname('file.typescript', 'ts')).toBe(false)
      expect(hasExtname('file.javascript', 'js')).toBe(false)
    })
  })
})
