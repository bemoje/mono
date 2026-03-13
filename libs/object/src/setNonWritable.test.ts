import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { setNonWritable } from './setNonWritable'

describe('setNonWritable', () => {
  it('should set the writable property to true.', () => {
    const o = { a: 1 }
    setNonWritable(o, 'a')
    expect(() => {
      return (o.a = 2)
    }).toThrowError()
    expect(o.a).toBe(1)
  })

  it('should set the property for multiple inputs.', () => {
    const o = { a: 1, b: 1 }
    setNonWritable(o, 'a', 'b')
    expect(() => {
      return (o.a = 2)
    }).toThrowError()
    expect(() => {
      return (o.b = 2)
    }).toThrowError()
    expect(o.a).toBe(1)
    expect(o.b).toBe(1)
  })
})
