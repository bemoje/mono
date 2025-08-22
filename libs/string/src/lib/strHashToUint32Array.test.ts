import { strHashToUint32Array } from './strHashToUint32Array'
import { describe, expect, it } from 'vitest'

describe('strHashToUint32Array', () => {
  it('should hash a string into an array of unsigned 32-bit integers', () => {
    const string = 'hello'
    const algorithm = 'sha256'
    const result = strHashToUint32Array(string, algorithm)
    const expected = new Uint32Array([
      3125670444, 245608543, 708569126, 2665658821, 1545475611, 1581426463, 1647510643, 613976979,
    ])
    expect(result).toEqual(expected)
  })
})
