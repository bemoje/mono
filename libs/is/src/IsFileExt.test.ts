import { IsFileExt } from './IsFileExt'
import { describe, expect, it } from 'vitest'

describe(IsFileExt.name, () => {
  it('should create file extension validator', () => {
    const tests = (isHtmlFileExt: ReturnType<typeof IsFileExt>) => {
      expect(isHtmlFileExt.name).toBe('isHtmlFileExt')
      expect(isHtmlFileExt('asd/file.html')).toBe(true)
      expect(isHtmlFileExt('asd\\file.html')).toBe(true)
      expect(isHtmlFileExt('file.html')).toBe(true)
      expect(isHtmlFileExt('file.HtmL')).toBe(true)
      expect(isHtmlFileExt('.html')).toBe(true)
      expect(isHtmlFileExt('html')).toBe(false)
    }

    tests(IsFileExt('.html'))
    tests(IsFileExt('html'))
  })
})
