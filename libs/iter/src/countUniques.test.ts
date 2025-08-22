import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { countUniques } from './countUniques'

describe(countUniques.name, () => {
  it('examples', () => {
    expect(() => {
      // basic counting
      const counts = countUniques([1, 2, 2, 3, 3, 3])
      assert.deepStrictEqual(
        [...counts.entries()],
        [
          [3, 3],
          [2, 2],
          [1, 1],
        ],
        'sorted by count descending',
      )

      // strings
      const stringCounts = countUniques(['a', 'b', 'a', 'c'])
      assert.deepStrictEqual(
        [...stringCounts.entries()],
        [
          ['a', 2],
          ['b', 1],
          ['c', 1],
        ],
        'string counts',
      )

      // empty iterable
      const empty = countUniques([])
      assert.deepStrictEqual([...empty.entries()], [], 'empty iterable')
    }).not.toThrow()
  })

  it('should count unique values correctly', () => {
    const result = countUniques([1, 2, 2, 3, 3, 3])
    expect(result.get(1)).toBe(1)
    expect(result.get(2)).toBe(2)
    expect(result.get(3)).toBe(3)
  })

  it('should sort by count descending', () => {
    const result = countUniques(['a', 'b', 'b', 'c', 'c', 'c'])
    const entries = [...result.entries()]
    expect(entries[0]).toEqual(['c', 3])
    expect(entries[1]).toEqual(['b', 2])
    expect(entries[2]).toEqual(['a', 1])
  })

  it('should handle empty iterables', () => {
    const result = countUniques([])
    expect([...result.entries()]).toEqual([])
  })

  it('should handle single element', () => {
    const result = countUniques([42])
    expect([...result.entries()]).toEqual([[42, 1]])
  })

  it('should work with different data types', () => {
    const objects = [{ id: 1 }, { id: 2 }, { id: 1 }]
    const result = countUniques(objects)
    expect(result.size).toBe(3) // Each object is unique by reference
  })
})
