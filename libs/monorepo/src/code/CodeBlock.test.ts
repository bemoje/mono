import { describe, expect, it } from 'vitest'
import { CodeBlock } from './CodeBlock'

describe(CodeBlock.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(CodeBlock.inspector).toBeDefined()
    })
  })
})
