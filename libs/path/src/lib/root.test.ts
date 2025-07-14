import { describe, it, expect } from 'vitest'
import { root } from './root'

describe(root.name, () => {
  const paths = [
    { input: '/home/user/docs', expected: '/' },
    { input: 'C:\\Users\\User\\Documents', expected: 'C:/' },
    { input: 'D:\\Folder\\Subfolder', expected: 'D:/' },
    { input: '/', expected: '/' },
    { input: 'C:/', expected: 'C:/' },
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
