import { strUnwrap } from './strUnwrap'
import { describe, expect, it } from 'vitest'

describe('strUnwrap', () => {
  it('should remove the left and right strings from the input string', () => {
    expect(strUnwrap('Hello, world!', 'Hello, ', '!')).toBe('world')
    expect(strUnwrap('Hello, world!', 'Hello, ', '!', 'g')).toBe('world')
    expect(strUnwrap('Hello, world!', 'Goodbye, ', '!')).toBe('Hello, world')
    expect(strUnwrap('Hello, world!', 'Goodbye, ', '!', 'g')).toBe('Hello, world')
  })

  it('should remove the left and right strings from the input string with special characters', () => {
    expect(strUnwrap('<p>Hello, world!</p>', '<p>', '</p>')).toBe('Hello, world!')
    expect(strUnwrap('<p>Hello, world!</p>', '<P>', '</P>', 'i')).toBe('Hello, world!')
    expect(strUnwrap('<p>Hello, world!</p>', '<div>', '</div>')).toBe('<p>Hello, world!</p>')
  })

  it('should remove left and right substrings from the input', () => {
    expect(strUnwrap('hello world', 'hello', 'world')).toBe(' ')
  })

  it('should remove left substring from the input when right substring is not present', () => {
    expect(strUnwrap('hello world', 'hello', 'test')).toBe(' world')
  })

  it('should remove right substring from the input when left substring is not present', () => {
    expect(strUnwrap('hello world', 'test', 'world')).toBe('hello ')
  })

  it('should return the same string when neither left nor right substrings are present', () => {
    expect(strUnwrap('hello world', 'test', 'example')).toBe('hello world')
  })

  it('should remove left and right substrings case insensitively when "i" flag is passed', () => {
    expect(strUnwrap('Hello World', 'hello', 'world', 'i')).toBe(' ')
  })

  it('should return the same string when input is empty', () => {
    expect(strUnwrap('', 'hello', 'world')).toBe('')
  })

  it('should return the same string when left and right substrings are empty', () => {
    expect(strUnwrap('hello world', '', '')).toBe('hello world')
  })

  it('should remove only the left substring when right substring is empty', () => {
    expect(strUnwrap('hello world', 'hello', '')).toBe(' world')
  })

  it('should remove only the right substring when left substring is empty', () => {
    expect(strUnwrap('hello world', '', 'world')).toBe('hello ')
  })
})
