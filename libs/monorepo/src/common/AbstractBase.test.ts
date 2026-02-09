import { describe, expect, it } from 'vitest'
import { AbstractBase } from './AbstractBase'

describe(AbstractBase.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(AbstractBase.inspector).toBeDefined()
    })
  })
})
