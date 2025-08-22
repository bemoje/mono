import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { Type, TString, TArray } from '@sinclair/typebox'
import { TemplateStrategy } from './TemplateStrategy'

// Mock implementation for testing the interface
class MockTemplateStrategy implements TemplateStrategy<TString> {
  readonly templateSchema = Type.String()

  templateToString(template: string): string {
    return `[TEMPLATE]: ${template}`
  }

  render(populated: string): string {
    return populated.replace('[TEMPLATE]: ', '')
  }
}

describe('TemplateStrategy', () => {
  it('examples', () => {
    expect(() => {
      // Basic interface implementation
      const strategy = new MockTemplateStrategy()

      // Check interface compliance
      assert.ok(strategy.templateSchema)
      assert.strictEqual(typeof strategy.templateToString, 'function')
      assert.strictEqual(typeof strategy.render, 'function')

      // Test template processing workflow
      const template = 'Hello {{name}}!'
      const stringified = strategy.templateToString(template)
      assert.deepStrictEqual(stringified, '[TEMPLATE]: Hello {{name}}!')

      const populated = '[TEMPLATE]: Hello World!'
      const rendered = strategy.render(populated)
      assert.deepStrictEqual(rendered, 'Hello World!')
    }).not.toThrow()
  })

  describe('interface contract', () => {
    it('should define required properties and methods', () => {
      const strategy = new MockTemplateStrategy()

      expect(strategy).toHaveProperty('templateSchema')
      expect(strategy).toHaveProperty('templateToString')
      expect(strategy).toHaveProperty('render')

      expect(typeof strategy.templateToString).toBe('function')
      expect(typeof strategy.render).toBe('function')
    })

    it('should have readonly templateSchema', () => {
      const strategy = new MockTemplateStrategy()

      // Check that the property exists and is defined
      expect(strategy.templateSchema).toBeDefined()
      expect(strategy.templateSchema.type).toBe('string')
    })

    it('should enforce schema type parameter', () => {
      const strategy = new MockTemplateStrategy()

      expect(strategy.templateSchema.type).toBe('string')
    })
  })

  describe('templateToString method contract', () => {
    it('should accept template conforming to schema', () => {
      const strategy = new MockTemplateStrategy()
      const template = 'Valid string template'

      expect(() => {
        strategy.templateToString(template)
      }).not.toThrow()
    })

    it('should return string representation', () => {
      const strategy = new MockTemplateStrategy()
      const template = 'Test template'

      const result = strategy.templateToString(template)

      expect(typeof result).toBe('string')
      expect(result).toBe('[TEMPLATE]: Test template')
    })
  })

  describe('render method contract', () => {
    it('should accept populated string', () => {
      const strategy = new MockTemplateStrategy()
      const populated = '[TEMPLATE]: Populated content'

      expect(() => {
        strategy.render(populated)
      }).not.toThrow()
    })

    it('should return typed result conforming to schema', () => {
      const strategy = new MockTemplateStrategy()
      const populated = '[TEMPLATE]: Final result'

      const result = strategy.render(populated)

      expect(typeof result).toBe('string')
      expect(result).toBe('Final result')
    })
  })

  describe('strategy pattern implementation', () => {
    it('should allow different template processing strategies', () => {
      // Alternative strategy implementation
      class AlternativeStrategy implements TemplateStrategy<TString> {
        readonly templateSchema = Type.String()

        templateToString(template: string): string {
          return template.toUpperCase()
        }

        render(populated: string): string {
          return populated.toLowerCase()
        }
      }

      const mockStrategy = new MockTemplateStrategy()
      const altStrategy = new AlternativeStrategy()

      const template = 'Hello World'

      const mockResult = mockStrategy.templateToString(template)
      const altResult = altStrategy.templateToString(template)

      expect(mockResult).toBe('[TEMPLATE]: Hello World')
      expect(altResult).toBe('HELLO WORLD')

      expect(mockStrategy.render(mockResult)).toBe('Hello World')
      expect(altStrategy.render(altResult)).toBe('hello world')
    })

    it('should work with different schema types', () => {
      class ArrayStrategy implements TemplateStrategy<TArray<TString>> {
        readonly templateSchema = Type.Array(Type.String())

        templateToString(template: string[]): string {
          return template.join(',')
        }

        render(populated: string): string[] {
          return populated.split(',')
        }
      }

      const arrayStrategy = new ArrayStrategy()
      const template = ['a', 'b', 'c']

      const stringified = arrayStrategy.templateToString(template)
      expect(stringified).toBe('a,b,c')

      const rendered = arrayStrategy.render(stringified)
      expect(rendered).toEqual(['a', 'b', 'c'])
    })
  })

  describe('type safety', () => {
    it('should enforce type constraints through generics', () => {
      const strategy = new MockTemplateStrategy()

      // This should work with string schema
      expect(() => {
        strategy.templateToString('valid string')
      }).not.toThrow()

      // TypeScript would catch type mismatches at compile time
      expect(strategy.templateSchema.type).toBe('string')
    })
  })
})
