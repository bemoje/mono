import { describe } from "vitest";
import { expect } from "vitest";
import { it } from "vitest";
import { getTempDataPath } from './getTempDataPath'

describe(getTempDataPath.name, () => {
  it('returns the path to the os temp dir', () => {
    expect(typeof getTempDataPath()).toBe('string')
    expect(getTempDataPath('myapp').endsWith('myapp')).toBe(true)
    expect(getTempDataPath('myapp', 'dir').endsWith('dir')).toBe(true)
  })
})
