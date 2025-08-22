import { describe, it, expect } from 'vitest'
import { isValidWin32 } from './isValidWin32'

describe(isValidWin32.name, () => {
  it('example', () => {
    isValidWin32('C:\\Users\\John')
    // => true
  })
  it('accepts backslash', () => {
    expect(isValidWin32('C:\\Users\\Benjamin\\Desktop')).toBe(true)
  })
  it('accepts forward slash', () => {
    expect(isValidWin32('C:/Users/John/Desktop')).toBe(true)
  })
  it('rejects on both forward and backward slash in same path', () => {
    expect(isValidWin32('C:/Users\\John')).toBe(false)
  })
  it('rejects when exceeding max length unless extendedMaxLength is enabled', () => {
    const longPath =
      'C:/Users/John/Desktop/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
      'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/index.js'
    expect(isValidWin32(longPath)).toBe(false)
    expect(isValidWin32(longPath, { extendedMaxLength: true })).toBe(true)
  })
  it('accepts network path', () => {
    expect(isValidWin32('\\\\192.168.1.2')).toBe(true)
  })
  it('rejects on empty string', () => {
    expect(isValidWin32('')).toBe(false)
  })
  it('rejects on illegal characters in windows file names', () => {
    expect(isValidWin32('C:\\cool\\wow<wow.js')).toBe(false)
    expect(isValidWin32('C:\\cool\\wow>wow.js')).toBe(false)
    expect(isValidWin32('C:\\cool\\wow:wow.js')).toBe(false)
    expect(isValidWin32('C:\\cool\\wow"wow.js')).toBe(false)
    expect(isValidWin32('C:\\cool\\wow|wow.js')).toBe(false)
    expect(isValidWin32('C:\\cool\\wow?wow.js')).toBe(false)
    expect(isValidWin32('C:\\cool\\wow*wow.js')).toBe(false)
  })
  it('rejects on illegal windows filenames', () => {
    expect(isValidWin32('C:\\cool\\CON')).toBe(false)
    expect(isValidWin32('C:\\cool\\PRN')).toBe(false)
    expect(isValidWin32('C:\\cool\\AUX')).toBe(false)
    expect(isValidWin32('C:\\cool\\NUL')).toBe(false)
    expect(isValidWin32('C:\\cool\\COM1')).toBe(false)
    expect(isValidWin32('C:\\cool\\COM2')).toBe(false)
    expect(isValidWin32('C:\\cool\\COM3')).toBe(false)
    expect(isValidWin32('C:\\cool\\COM4')).toBe(false)
    expect(isValidWin32('C:\\cool\\COM5')).toBe(false)
    expect(isValidWin32('C:\\cool\\COM6')).toBe(false)
    expect(isValidWin32('C:\\cool\\COM7')).toBe(false)
    expect(isValidWin32('C:\\cool\\COM8')).toBe(false)
    expect(isValidWin32('C:\\cool\\COM9')).toBe(false)
    expect(isValidWin32('C:\\cool\\LPT1')).toBe(false)
    expect(isValidWin32('C:\\cool\\LPT2')).toBe(false)
    expect(isValidWin32('C:\\cool\\LPT3')).toBe(false)
    expect(isValidWin32('C:\\cool\\LPT4')).toBe(false)
    expect(isValidWin32('C:\\cool\\LPT5')).toBe(false)
    expect(isValidWin32('C:\\cool\\LPT6')).toBe(false)
    expect(isValidWin32('C:\\cool\\LPT7')).toBe(false)
    expect(isValidWin32('C:\\cool\\LPT8')).toBe(false)
    expect(isValidWin32('C:\\cool\\LPT9')).toBe(false)
  })
  it('accepts on illegal windows filename strings as part of filename', () => {
    expect(isValidWin32('C:\\cool\\CON.txt')).toBe(true)
  })
  it('accets on illegal windows filename strings as part of directory name', () => {
    expect(isValidWin32('C:\\CON4\\file.txt')).toBe(true)
  })
  it('rejects on illegal windows filename string as directory name', () => {
    expect(isValidWin32('C:\\CON\\file.txt')).toBe(false)
  })
  it('rejects on invalid drive letter', () => {
    expect(isValidWin32('CC:\\CON\\file.txt')).toBe(false)
  })
})
