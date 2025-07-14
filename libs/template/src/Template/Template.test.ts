import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { Type } from '@sinclair/typebox'
import { Template } from './Template'
import { StringTemplateStrategy } from '../strategies/StringTemplateStrategy'
import { JsonFileTemplateStrategy } from '../strategies/JsonFileTemplateStrategy'
import { TextFileTemplateStrategy } from '../strategies/TextFileTemplateStrategy'

describe(Template.name, () => {
  it('examples', () => {
    expect(() => {
      // Basic string template
      const stringStrategy = new StringTemplateStrategy()
      const stringOptionsSchema = Type.Object({
        name: Type.String({ default: 'World' }),
        greeting: Type.String({ default: 'Hello' }),
      })

      const stringTemplate = new Template({
        strategy: stringStrategy,
        optionsSchema: stringOptionsSchema,
        template: '{{greeting}} {{name}}!',
      })

      const result = stringTemplate.render({ name: 'TypeScript', greeting: 'Hi' })
      assert.deepStrictEqual(result, 'Hi TypeScript!')

      // JSON template
      const jsonStrategy = new JsonFileTemplateStrategy(
        Type.Object({
          name: Type.String(),
          version: Type.String(),
        }),
      )
      const jsonOptionsSchema = Type.Object({
        packageName: Type.String(),
        version: Type.String({ default: '1.0.0' }),
      })

      const jsonTemplate = new Template({
        strategy: jsonStrategy,
        optionsSchema: jsonOptionsSchema,
        template: {
          name: '{{packageName}}',
          version: '{{version}}',
        },
      })

      const jsonResult = jsonTemplate.render({ packageName: 'my-package', version: '2.0.0' })
      assert.deepStrictEqual(jsonResult, { name: 'my-package', version: '2.0.0' })

      // Text file template
      const textStrategy = new TextFileTemplateStrategy()
      const textOptionsSchema = Type.Object({
        className: Type.String(),
        author: Type.String({ default: 'Developer' }),
      })

      const textTemplate = new Template({
        strategy: textStrategy,
        optionsSchema: textOptionsSchema,
        template: ['export class {{className}} {', '  // by {{author}}', '}'],
      })

      const textResult = textTemplate.render({ className: 'MyClass', author: 'Dev' })
      assert.deepStrictEqual(textResult, ['export class MyClass {', '  // by Dev', '}'])
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should initialize with required options', () => {
      const strategy = new StringTemplateStrategy()
      const template = new Template({
        strategy,
        template: 'Hello {{name}}!',
      })

      expect(template).toBeInstanceOf(Template)
    })

    it('should use default empty schema when optionsSchema not provided', () => {
      const strategy = new StringTemplateStrategy()
      const template = new Template({
        strategy,
        template: 'Hello World!',
      })

      const result = template.render()
      expect(result).toBe('Hello World!')
    })

    it('should validate template contains all schema variables', () => {
      const strategy = new StringTemplateStrategy()
      const optionsSchema = Type.Object({
        name: Type.String(),
        age: Type.Number(),
      })

      expect(() => {
        new Template({
          strategy,
          optionsSchema,
          template: 'Hello {{name}}!', // Missing {{age}}
        })
      }).toThrow('Template does not include variable: age')
    })
  })

  describe(Template.prototype.render.name, () => {
    it('should render template with provided data', () => {
      const strategy = new StringTemplateStrategy()
      const optionsSchema = Type.Object({
        name: Type.String(),
        title: Type.String({ default: 'Mr.' }),
      })

      const template = new Template({
        strategy,
        optionsSchema,
        template: '{{title}} {{name}}',
      })

      const result = template.render({ name: 'Smith', title: 'Dr.' })
      expect(result).toBe('Dr. Smith')
    })

    it('should use default values from schema', () => {
      const strategy = new StringTemplateStrategy()
      const optionsSchema = Type.Object({
        greeting: Type.String({ default: 'Hello' }),
        name: Type.String({ default: 'World' }),
      })

      const template = new Template({
        strategy,
        optionsSchema,
        template: '{{greeting}} {{name}}!',
      })

      const result = template.render()
      expect(result).toBe('Hello World!')
    })

    it('should handle multiple variable substitutions', () => {
      const strategy = new StringTemplateStrategy()
      const optionsSchema = Type.Object({
        first: Type.String(),
        second: Type.String(),
        third: Type.String(),
      })

      const template = new Template({
        strategy,
        optionsSchema,
        template: '{{first}}-{{second}}-{{third}}',
      })

      const result = template.render({
        first: 'A',
        second: 'B',
        third: 'C',
      })
      expect(result).toBe('A-B-C')
    })

    it('should handle missing properties gracefully', () => {
      const strategy = new StringTemplateStrategy()
      const optionsSchema = Type.Object({
        name: Type.String(),
        title: Type.String({ default: 'Mr.' }),
      })

      const template = new Template({
        strategy,
        optionsSchema,
        template: '{{title}} {{name}}',
      })

      // When property is missing, it gets converted to empty string
      const result = template.render({ title: 'Dr.' } as any)
      expect(result).toBe('Dr. ')
    })
  })

  describe(Template.prototype.renderString.name, () => {
    it('should render and return string representation', () => {
      const strategy = new JsonFileTemplateStrategy(
        Type.Object({
          name: Type.String(),
        }),
      )
      const optionsSchema = Type.Object({
        packageName: Type.String(),
      })

      const template = new Template({
        strategy,
        optionsSchema,
        template: { name: '{{packageName}}' },
      })

      const result = template.renderString({ packageName: 'test-package' })
      expect(result).toBe('{\n  "name": "test-package"\n}')
    })
  })

  describe(Template.prototype.createSchema.name, () => {
    it('should return template schema with default value', () => {
      const strategy = new StringTemplateStrategy()
      const template = new Template({
        strategy,
        template: 'Hello World!',
      })

      const schema = template.createSchema()
      expect(schema.default).toBe('Hello World!')
    })
  })

  describe('error handling', () => {
    it('should handle missing variables gracefully', () => {
      const strategy = new StringTemplateStrategy()
      const optionsSchema = Type.Object({
        name: Type.String({ default: 'Unknown' }),
      })

      const template = new Template({
        strategy,
        optionsSchema,
        template: 'Hello {{name}} and {{missing}}!',
      })

      const result = template.render()
      expect(result).toBe('Hello Unknown and undefined!')
    })

    it('should convert non-string values to strings', () => {
      const strategy = new StringTemplateStrategy()
      const optionsSchema = Type.Object({
        count: Type.Number({ default: 42 }),
        active: Type.Boolean({ default: true }),
      })

      const template = new Template({
        strategy,
        optionsSchema,
        template: 'Count: {{count}}, Active: {{active}}',
      })

      const result = template.render()
      expect(result).toBe('Count: 42, Active: true')
    })
  })
})
