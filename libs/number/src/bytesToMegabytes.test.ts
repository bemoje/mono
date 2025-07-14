import { bytesToMegabytes } from './bytesToMegabytes'
import { describe, expect, it } from 'vitest'

describe('bytesToMegabytes', () => {
  it('should convert bytes to megabytes', () => {
    expect(bytesToMegabytes(1048576)).toBe(1)
    expect(bytesToMegabytes(2097152)).toBe(2)
    expect(bytesToMegabytes(3145728)).toBe(3)
    expect(bytesToMegabytes(0)).toBe(0)
  })
})
