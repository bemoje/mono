import { describe, it, expect } from 'vitest'
import { entriesOf } from './entriesOf'

describe(entriesOf.name, () => {
  it('should behave identically to Object.entries()', () => {
    const obj = { a: 1, b: 2 }
    expect(entriesOf(obj)).toEqual(Object.entries(obj))
  })

  it('should handle empty objects gracefully', () => {
    const result = entriesOf({})
    expect(result).toEqual([])
  })
})
