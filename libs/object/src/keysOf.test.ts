import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'
import { keysOf } from './keysOf'

describe(keysOf.name, () => {
  it('should behave identically to Object.keys()', () => {
    const obj = { a: 1, b: 2 }
    expect(keysOf(obj)).toEqual(Object.keys(obj))
  })

  it('should handle empty objects gracefully', () => {
    const result = keysOf({})
    expect(result).toEqual([])
  })
})
