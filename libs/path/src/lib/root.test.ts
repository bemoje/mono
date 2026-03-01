import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { root } from './root'

describe(root.name, () => {
  const isWindows = process.platform === 'win32'

  const paths =
    isWindows ?
      [
        { input: '/home/user/docs', expected: '/' },
        { input: 'C:\\Users\\User\\Documents', expected: 'C:/' },
        { input: 'D:\\Folder\\Subfolder', expected: 'D:/' },
        { input: '/', expected: '/' },
        { input: 'C:/', expected: 'C:/' },
        { input: '', expected: '' },
      ]
    : [
        { input: '/home/user/docs', expected: '/' },
        { input: '/', expected: '/' },
        { input: '', expected: '' },
      ]

  it('should return the root directory of a given path', () => {
    paths.forEach(({ input, expected }) => {
      expect(root(input)).toBe(expected)
    })
  })

  it('should handle edge cases gracefully', () => {
    expect(root('')).toBe('')
  })
})
