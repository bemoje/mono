import { setWritable } from './setWritable'
import { describe, expect, it } from 'vitest'

describe('setWritable', () => {
  it('should set the writable property to true.', () => {
    const o = { a: 1 }
    Object.defineProperty(o, 'a', { writable: false })
    expect(() => (o.a = 2)).toThrowError()
    expect(o.a).toBe(1)
    setWritable(o, 'a')
    o.a = 2
    expect(o.a).toBe(2)
  })
})
