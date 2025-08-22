import { describe, expect, it } from 'vitest'
import * as EXPORTS from './index'

describe('index.ts', () => {
  it('should load modules', () => {
    for (const [key, value] of Object.entries(EXPORTS)) {
      expect(key).toBeTypeOf('string')
      expect(value).not.toBeUndefined()
    }
  })
})
