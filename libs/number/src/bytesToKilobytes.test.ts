import { bytesToKilobytes } from './bytesToKilobytes'
import { describe, expect, it } from 'vitest'

describe('bytesToKilobytes', () => {
  it('should convert bytes to megabytes', () => {
    expect(bytesToKilobytes(1024)).toBe(1)
    expect(bytesToKilobytes(2048)).toBe(2)
    expect(bytesToKilobytes(7168)).toBe(7)
    expect(bytesToKilobytes(0)).toBe(0)
  })
})
