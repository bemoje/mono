import { describe, expect, it } from 'vitest'
import { getAppDataPath } from './getAppDataPath'

describe(getAppDataPath.name, () => {
  it('returns an appdata path', () => {
    expect(typeof getAppDataPath()).toBe('string')
    expect(getAppDataPath('myapp').endsWith('myapp')).toBe(true)
    expect(getAppDataPath('myapp', 'dir').endsWith('dir')).toBe(true)
  })
})
