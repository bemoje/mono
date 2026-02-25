import { CodeBlock } from './CodeBlock'
import { describe } from 'vitest'
import { expect } from 'vitest'
import { it } from 'vitest'

describe(CodeBlock.name, () => {
  describe('inspector', () => {
    it('should be defined as a static property', () => {
      expect(CodeBlock.inspector).toBeDefined()
    })
  })
})
