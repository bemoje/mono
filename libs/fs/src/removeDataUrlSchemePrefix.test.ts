import { describe, expect, it } from 'vitest'
import { removeDataUrlSchemePrefix } from './removeDataUrlSchemePrefix'

describe('removeDataUrlSchemePrefix', () => {
  it('should be a function', () => {
    expect(typeof removeDataUrlSchemePrefix).toBe('function')
  })
  it('should remove the prefix from a data URL', () => {
    const dataUrl = 'data:image/png;base64,abc123'
    const result = removeDataUrlSchemePrefix(dataUrl)
    expect(result).toBe('abc123')
  })
  it('should remove the prefix from a data URL from spy', () => {
    const dataUrl = 'data:application/zip;base64,UEsDBBQAAgAIAEV8f1jlPLV88CkAANRjAAA8AAA'
    const result = removeDataUrlSchemePrefix(dataUrl)
    expect(result).toBe('UEsDBBQAAgAIAEV8f1jlPLV88CkAANRjAAA8AAA')
  })
})
