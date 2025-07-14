import { strHashToBuffer } from './strHashToBuffer'
import { describe, expect, it } from 'vitest'

describe('toBuffer', () => {
  it('should hash a string into a buffer with a given algorithm', () => {
    const string = 'hello'
    const algorithm = 'sha256'
    const result = strHashToBuffer(string, algorithm)
    expect(Array.from(result)).toEqual([
      44, 242, 77, 186, 95, 176, 163, 14, 38, 232, 59, 42, 197, 185, 226, 158, 27, 22, 30, 92, 31, 167, 66, 94,
      115, 4, 51, 98, 147, 139, 152, 36,
    ])
  })
})
