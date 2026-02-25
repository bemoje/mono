import { describe } from 'vitest'
import { expect } from 'vitest'
import { getWsPaths } from './getWsPaths'
import { it } from 'vitest'
import upath from 'upath'

describe(getWsPaths.name, () => {
  const fakeWsDir = upath.normalizeSafe('/some/repo/mono/libs/mylib')

  it('should return wsDir as normalized input', () => {
    const paths = getWsPaths(fakeWsDir)
    expect(paths.wsDir).toBe(fakeWsDir)
  })

  it('should extract wsDirname from the path', () => {
    const paths = getWsPaths(fakeWsDir)
    expect(paths.wsDirname).toBe('mylib')
  })

  it('should construct tsconfig path', () => {
    const paths = getWsPaths(fakeWsDir)
    expect(paths.tsconfig).toBe(upath.joinSafe(fakeWsDir, 'tsconfig.json'))
  })

  it('should construct package.json path', () => {
    const paths = getWsPaths(fakeWsDir)
    expect(paths.pkg).toBe(upath.joinSafe(fakeWsDir, 'package.json'))
  })

  it('should construct srcDir path', () => {
    const paths = getWsPaths(fakeWsDir)
    expect(paths.srcDir).toBe(upath.joinSafe(fakeWsDir, 'src'))
  })

  it('should construct indexTs path', () => {
    const paths = getWsPaths(fakeWsDir)
    expect(paths.indexTs).toBe(upath.joinSafe(fakeWsDir, 'src/index.ts'))
  })

  it('should construct indexCjs path under .dist/libs', () => {
    const paths = getWsPaths(fakeWsDir)
    expect(paths.indexCjs).toMatch(/\.dist\/libs\/mylib\.cjs$/)
  })

  it('should construct indexMjs path under .dist/libs', () => {
    const paths = getWsPaths(fakeWsDir)
    expect(paths.indexMjs).toMatch(/\.dist\/libs\/mylib\.mjs$/)
  })

  it('should provide a toRelative function', () => {
    const paths = getWsPaths(fakeWsDir)
    expect(typeof paths.toRelative).toBe('function')
  })

  it('toRelative should return a relative path from repo root', () => {
    const paths = getWsPaths(fakeWsDir)
    const relative = paths.toRelative(paths.indexTs)
    expect(relative).not.toMatch(/^\//)
    expect(relative).toContain('src/index.ts')
  })
})
