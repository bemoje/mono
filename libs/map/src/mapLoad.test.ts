import { describe, expect, it } from 'vitest'
import { mapLoad } from './mapLoad'
import { expectType } from 'tsd'

describe(mapLoad.name, () => {
  it('should allow expanding both K and V types when loading data', () => {
    const map = new Map<number, string>([[1, 'a']])
    const map2 = mapLoad(map, [[2, 'b']])
    expect(map2.size).toBe(2)
    expectType<Map<number, string>>(map2)
  })
})
