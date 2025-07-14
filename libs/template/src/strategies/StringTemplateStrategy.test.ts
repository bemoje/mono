import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { StringTemplateStrategy } from './StringTemplateStrategy'

describe(StringTemplateStrategy.name, () => {
  it('examples', () => {
    expect(() => {
      const strategy = new StringTemplateStrategy()

      // Basic string handling
      const template = 'Hello World!'
      const stringified = strategy.templateToString(template)
      assert.deepStrictEqual(stringified, 'Hello World!')

      const rendered = strategy.render(stringified)
      assert.deepStrictEqual(rendered, 'Hello World!')

      // Template with variables
      const variableTemplate = 'Hello {{name}}!'
      const processedTemplate = strategy.templateToString(variableTemplate)
      assert.deepStrictEqual(processedTemplate, 'Hello {{name}}!')

      const populatedString = 'Hello TypeScript!'
      const finalResult = strategy.render(populatedString)
      assert.deepStrictEqual(finalResult, 'Hello TypeScript!')
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should initialize with string schema', () => {
      const strategy = new StringTemplateStrategy()

      expect(strategy.templateSchema).toBeDefined()
      expect(strategy.templateSchema.type).toBe('string')
    })
  })

  describe(StringTemplateStrategy.prototype.templateToString.name, () => {
    it('should return string as-is (pass-through)', () => {
      const strategy = new StringTemplateStrategy()
      const template = 'Any string content'

      const result = strategy.templateToString(template)

      expect(result).toBe(template)
      expect(result).toBe('Any string content')
    })

    it('should handle empty strings', () => {
      const strategy = new StringTemplateStrategy()

      const result = strategy.templateToString('')

      expect(result).toBe('')
    })

    it('should handle special characters', () => {
      const strategy = new StringTemplateStrategy()
      const template = 'Special chars: !@#$%^&*(){{}}[]'

      const result = strategy.templateToString(template)

      expect(result).toBe(template)
    })

    it('should handle multiline strings', () => {
      const strategy = new StringTemplateStrategy()
      const template = 'Line 1\nLine 2\nLine 3'

      const result = strategy.templateToString(template)

      expect(result).toBe(template)
    })
  })

  describe(StringTemplateStrategy.prototype.render.name, () => {
    it('should return string as-is (pass-through)', () => {
      const strategy = new StringTemplateStrategy()
      const populated = 'Populated template content'

      const result = strategy.render(populated)

      expect(result).toBe(populated)
    })

    it('should handle empty populated string', () => {
      const strategy = new StringTemplateStrategy()

      const result = strategy.render('')

      expect(result).toBe('')
    })

    it('should handle populated strings with variables replaced', () => {
      const strategy = new StringTemplateStrategy()
      const populated = 'Hello John Doe!'

      const result = strategy.render(populated)

      expect(result).toBe('Hello John Doe!')
    })
  })

  describe('schema validation', () => {
    it('should have correct schema type', () => {
      const strategy = new StringTemplateStrategy()

      expect(strategy.templateSchema.type).toBe('string')
    })

    it('should be readonly templateSchema', () => {
      const strategy = new StringTemplateStrategy()

      // Check that the property exists and is correctly typed
      expect(strategy.templateSchema).toBeDefined()
      expect(strategy.templateSchema.type).toBe('string')
    })
  })
})
