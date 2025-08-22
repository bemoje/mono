import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { Type } from '@sinclair/typebox'
import { JsonFileTemplateStrategy } from './JsonFileTemplateStrategy'

describe(JsonFileTemplateStrategy.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic JSON object handling
      const strategy = new JsonFileTemplateStrategy()
      const template = { name: 'test', version: '1.0.0' }

      const stringified = strategy.templateToString(template)
      assert.deepStrictEqual(stringified, '{\n  "name": "test",\n  "version": "1.0.0"\n}')

      const rendered = strategy.render(stringified)
      assert.deepStrictEqual(rendered, template)

      // With schema validation
      const schema = Type.Object({
        name: Type.String(),
        version: Type.String(),
        author: Type.String(),
      })

      const typedStrategy = new JsonFileTemplateStrategy(schema)
      const typedTemplate = {
        name: '{{packageName}}',
        version: '{{version}}',
        author: '{{author}}',
      }

      const typedStringified = typedStrategy.templateToString(typedTemplate)
      const populatedJson = '{\n  "name": "my-package",\n  "version": "2.0.0",\n  "author": "Developer"\n}'
      const typedRendered = typedStrategy.render(populatedJson)

      assert.deepStrictEqual(typedRendered, {
        name: 'my-package',
        version: '2.0.0',
        author: 'Developer',
      })
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should initialize with default empty object schema when no schema provided', () => {
      const strategy = new JsonFileTemplateStrategy()

      expect(strategy.templateSchema).toBeDefined()
      expect(strategy.templateSchema.type).toBe('object')
    })

    it('should initialize with provided schema', () => {
      const schema = Type.Object({
        name: Type.String(),
        version: Type.String(),
      })

      const strategy = new JsonFileTemplateStrategy(schema)

      expect(strategy.templateSchema).toBe(schema)
    })
  })

  describe(JsonFileTemplateStrategy.prototype.templateToString.name, () => {
    it('should convert object to pretty-printed JSON', () => {
      const strategy = new JsonFileTemplateStrategy()
      const template = { name: 'test', value: 42 }

      const result = strategy.templateToString(template)

      expect(result).toBe('{\n  "name": "test",\n  "value": 42\n}')
    })

    it('should handle empty objects', () => {
      const strategy = new JsonFileTemplateStrategy()
      const template = {}

      const result = strategy.templateToString(template)

      expect(result).toBe('{}')
    })

    it('should handle nested objects', () => {
      const strategy = new JsonFileTemplateStrategy()
      const template = {
        config: {
          debug: true,
          port: 3000,
        },
      }

      const result = strategy.templateToString(template)

      expect(result).toBe('{\n  "config": {\n    "debug": true,\n    "port": 3000\n  }\n}')
    })

    it('should handle arrays', () => {
      const strategy = new JsonFileTemplateStrategy()
      const template = {
        items: ['a', 'b', 'c'],
        count: 3,
      }

      const result = strategy.templateToString(template)

      expect(result).toBe('{\n  "items": [\n    "a",\n    "b",\n    "c"\n  ],\n  "count": 3\n}')
    })

    it('should handle template variables', () => {
      const strategy = new JsonFileTemplateStrategy()
      const template = {
        name: '{{packageName}}',
        version: '{{version}}',
      }

      const result = strategy.templateToString(template)

      expect(result).toBe('{\n  "name": "{{packageName}}",\n  "version": "{{version}}"\n}')
    })
  })

  describe(JsonFileTemplateStrategy.prototype.render.name, () => {
    it('should parse JSON string back to object', () => {
      const strategy = new JsonFileTemplateStrategy()
      const jsonString = '{\n  "name": "test",\n  "value": 42\n}'

      const result = strategy.render(jsonString)

      expect(result).toEqual({ name: 'test', value: 42 })
    })

    it('should handle minified JSON', () => {
      const strategy = new JsonFileTemplateStrategy()
      const jsonString = '{"name":"test","value":42}'

      const result = strategy.render(jsonString)

      expect(result).toEqual({ name: 'test', value: 42 })
    })

    it('should handle empty object JSON', () => {
      const strategy = new JsonFileTemplateStrategy()
      const jsonString = '{}'

      const result = strategy.render(jsonString)

      expect(result).toEqual({})
    })

    it('should handle complex nested structures', () => {
      const strategy = new JsonFileTemplateStrategy()
      const jsonString = '{"config":{"debug":true,"settings":{"theme":"dark"}},"version":"1.0.0"}'

      const result = strategy.render(jsonString)

      expect(result).toEqual({
        config: {
          debug: true,
          settings: {
            theme: 'dark',
          },
        },
        version: '1.0.0',
      })
    })
  })

  describe('error handling', () => {
    it('should throw on invalid JSON in render', () => {
      const strategy = new JsonFileTemplateStrategy()
      const invalidJson = '{"name": invalid}'

      expect(() => {
        strategy.render(invalidJson)
      }).toThrow()
    })

    it('should handle null values', () => {
      const strategy = new JsonFileTemplateStrategy()
      const template = { name: 'test', value: null }

      const stringified = strategy.templateToString(template)
      const rendered = strategy.render(stringified)

      expect(rendered).toEqual({ name: 'test', value: null })
    })
  })

  describe('roundtrip consistency', () => {
    it('should maintain data integrity through templateToString -> render cycle', () => {
      const strategy = new JsonFileTemplateStrategy()
      const original = {
        name: 'test-package',
        version: '1.2.3',
        dependencies: ['lodash', 'express'],
        config: {
          env: 'production',
          debug: false,
        },
      }

      const stringified = strategy.templateToString(original)
      const rendered = strategy.render(stringified)

      expect(rendered).toEqual(original)
    })
  })
})
