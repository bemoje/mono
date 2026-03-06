import * as EXPORTS from './index'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe('index.ts', () => {
  it('should load modules', () => {
    for (const [key, value] of Object.entries(EXPORTS)) {
      expect(key).toBeTypeOf('string')
      expect(value).not.toBeUndefined()
    }
  })
})
