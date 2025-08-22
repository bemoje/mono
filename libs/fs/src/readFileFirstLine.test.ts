import { describe, expect, it } from 'vitest'
import { readFileFirstLine } from './readFileFirstLine'

describe(readFileFirstLine.name, () => {
  it('should read first line of a file', async () => {
    const line = await readFileFirstLine(__filename)
    expect(typeof line).toBe('string')
  })
})
