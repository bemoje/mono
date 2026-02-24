import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { tsDocExtractAllComments } from "./tsdoc";
import { getNamedExportTsDocSummary } from "./tsdoc";

describe(tsDocExtractAllComments.name, () => {
  it('should extract a single TSDoc block comment', () => {
    const code = ['/**', ' * A summary line.', ' */', 'export function foo() {}'].join('\n')
    const results = [...tsDocExtractAllComments(code)]
    expect(results).toHaveLength(1)
    expect(results[0].start).toBe(0)
    expect(results[0].end).toBe(2)
    expect(results[0].match).toBe('/**\n * A summary line.\n */')
    expect(results[0].nextLine).toBe('export function foo() {}')
  })

  it('should extract multiple TSDoc block comments', () => {
    const code = [
      '/**',
      ' * First.',
      ' */',
      'export function a() {}',
      '',
      '/**',
      ' * Second.',
      ' */',
      'export function b() {}',
    ].join('\n')
    const results = [...tsDocExtractAllComments(code)]
    expect(results).toHaveLength(2)
    expect(results[0].match).toContain('First.')
    expect(results[1].match).toContain('Second.')
  })

  it('should skip empty lines when determining nextLine', () => {
    const code = ['/**', ' * Comment.', ' */', '', 'export function foo() {}'].join('\n')
    const results = [...tsDocExtractAllComments(code)]
    expect(results).toHaveLength(1)
    expect(results[0].nextLine).toBe('export function foo() {}')
  })

  it('should return no results for code without TSDoc', () => {
    const code = 'const x = 1;\nconst y = 2;'
    const results = [...tsDocExtractAllComments(code)]
    expect(results).toHaveLength(0)
  })

  it('should handle TSDoc at end of file with trailing empty line', () => {
    const code = ['/**', ' * Last comment.', ' */', ''].join('\n')
    const results = [...tsDocExtractAllComments(code)]
    expect(results).toHaveLength(1)
    expect(results[0].nextLine).toBe('')
  })

  it('should handle TSDoc at end of file with no trailing content', () => {
    const code = ['/**', ' * Last comment.', ' */'].join('\n')
    const results = [...tsDocExtractAllComments(code)]
    expect(results).toHaveLength(1)
    expect(results[0].nextLine).toBeUndefined()
  })

  it('should track offsets correctly for multiple comments', () => {
    const code = [
      '/**',
      ' * First.',
      ' */',
      'export function a() {}',
      '/**',
      ' * Second.',
      ' */',
      'export function b() {}',
    ].join('\n')
    const results = [...tsDocExtractAllComments(code)]
    expect(results[0].start).toBe(0)
    expect(results[0].end).toBe(2)
    expect(results[1].start).toBe(4)
    expect(results[1].end).toBe(6)
  })
})

describe(getNamedExportTsDocSummary.name, () => {
  it('should return the TSDoc summary for a named export', () => {
    const code = ['/**', ' * Does something useful.', ' */', 'export function doSomething() {}'].join('\n')
    const result = getNamedExportTsDocSummary('doSomething', code)
    expect(result).toBe('Does something useful.')
  })

  it('should return undefined for non-existent export', () => {
    const code = ['/**', ' * Does something.', ' */', 'export function doSomething() {}'].join('\n')
    const result = getNamedExportTsDocSummary('nonExistent', code)
    expect(result).toBeUndefined()
  })

  it('should skip default exports', () => {
    const code = ['/**', ' * Default thing.', ' */', 'export default function foo() {}'].join('\n')
    const result = getNamedExportTsDocSummary('foo', code)
    expect(result).toBeUndefined()
  })

  it('should handle multi-line TSDoc summaries', () => {
    const code = [
      '/**',
      ' * First line of the summary.',
      ' * Second line continues here.',
      ' */',
      'export function myFunc() {}',
    ].join('\n')
    const result = getNamedExportTsDocSummary('myFunc', code)
    expect(result).toBe('First line of the summary. Second line continues here.')
  })

  it('should stop at @tags', () => {
    const code = [
      '/**',
      ' * Summary text.',
      ' * @param x A number.',
      ' */',
      'export function calc(x: number) {}',
    ].join('\n')
    const result = getNamedExportTsDocSummary('calc', code)
    expect(result).toBe('Summary text.')
  })

  it('should return undefined for code without TSDoc', () => {
    const code = 'export function noDoc() {}'
    const result = getNamedExportTsDocSummary('noDoc', code)
    expect(result).toBeUndefined()
  })

  it('should not match a different named export', () => {
    const code = [
      '/**',
      ' * Docs for alpha.',
      ' */',
      'export function alpha() {}',
      '/**',
      ' * Docs for beta.',
      ' */',
      'export function beta() {}',
    ].join('\n')
    expect(getNamedExportTsDocSummary('alpha', code)).toBe('Docs for alpha.')
    expect(getNamedExportTsDocSummary('beta', code)).toBe('Docs for beta.')
    expect(getNamedExportTsDocSummary('gamma', code)).toBeUndefined()
  })

  it('should handle export with no nextLine', () => {
    const code = ['/**', ' * Orphan comment.', ' */'].join('\n')
    const result = getNamedExportTsDocSummary('anything', code)
    expect(result).toBeUndefined()
  })
})
