import * as fs from 'fs-extra'
import { describe, expect, it } from 'vitest'
import { getFileAge } from './getFileAge'

describe(getFileAge.name, () => {
  it('should find either ctime, birthtime or mtime ', async () => {
    const stats = await fs.stat(__filename)
    const time = stats.ctimeMs || stats.birthtimeMs || stats.mtimeMs
    expect(time).toBeDefined()
    expect(time).toBeGreaterThan(0)
  })

  it('should return the age of a file in milliseconds', async () => {
    const age = await getFileAge(__filename)
    expect(age).toBeLessThanOrEqual(Date.now())
  })
})
