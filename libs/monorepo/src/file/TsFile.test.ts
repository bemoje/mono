import { describe, expect, it } from 'vitest'
import { TsFile } from '../index'

describe(TsFile.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(TsFile.inspector).toBeDefined()
    })
  })
})
