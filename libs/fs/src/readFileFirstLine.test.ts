import { describe } from 'vitest'
import { expect } from 'vitest'
import fs from 'fs-extra'
import { it } from 'vitest'
import os from 'node:os'
import path from 'node:path'
import { readFileFirstLine } from './readFileFirstLine'

describe(readFileFirstLine.name, () => {
  it('should read first line of a file', async () => {
    const line = await readFileFirstLine(__filename)
    expect(typeof line).toBe('string')
    expect(line.length).toBeGreaterThan(0)
  })

  it('should return empty string for an empty file', async () => {
    const tmpFile = path.join(os.tmpdir(), `readFileFirstLine-empty-${Date.now()}.txt`)
    try {
      await fs.writeFile(tmpFile, '')
      const line = await readFileFirstLine(tmpFile)
      expect(line).toBe('')
    } finally {
      await fs.remove(tmpFile)
    }
  })

  it('should trim whitespace from the first line', async () => {
    const tmpFile = path.join(os.tmpdir(), `readFileFirstLine-trim-${Date.now()}.txt`)
    try {
      await fs.writeFile(tmpFile, '  hello world  \nsecond line')
      const line = await readFileFirstLine(tmpFile)
      expect(line).toBe('hello world')
    } finally {
      await fs.remove(tmpFile)
    }
  })

  it('should return first line only from multi-line file', async () => {
    const tmpFile = path.join(os.tmpdir(), `readFileFirstLine-multi-${Date.now()}.txt`)
    try {
      await fs.writeFile(tmpFile, 'first\nsecond\nthird')
      const line = await readFileFirstLine(tmpFile)
      expect(line).toBe('first')
    } finally {
      await fs.remove(tmpFile)
    }
  })
})
