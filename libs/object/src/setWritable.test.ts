import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { setWritable } from './setWritable'

describe('setWritable', () => {
  it('should set the writable property to true.', () => {
    const o = { a: 1 }
    Object.defineProperty(o, 'a', { writable: false })
    expect(() => {
      return (o.a = 2)
    }).toThrowError()
    expect(o.a).toBe(1)
    setWritable(o, 'a')
    o.a = 2
    expect(o.a).toBe(2)
  })
})
