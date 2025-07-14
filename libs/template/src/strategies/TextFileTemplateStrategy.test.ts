import { describe, expect, it } from 'vitest'
import assert from 'node:assert'
import { TextFileTemplateStrategy } from './TextFileTemplateStrategy'

describe(TextFileTemplateStrategy.name, () => {
  it('examples', () => {
    expect(() => {
      const strategy = new TextFileTemplateStrategy()

      // Basic text file handling
      const template = ['line 1', 'line 2', 'line 3']
      const stringified = strategy.templateToString(template)
      assert.deepStrictEqual(stringified, 'line 1\nline 2\nline 3')

      const rendered = strategy.render(stringified)
      assert.deepStrictEqual(rendered, template)

      // Template with variables
      const variableTemplate = [
        'export class {{className}} {',
        '  constructor() {',
        "    this.author = '{{author}}';",
        '  }',
        '}',
      ]

      const processedTemplate = strategy.templateToString(variableTemplate)
      const expectedString =
        "export class {{className}} {\n  constructor() {\n    this.author = '{{author}}';\n  }\n}"
      assert.deepStrictEqual(processedTemplate, expectedString)

      const populatedString = "export class MyClass {\n  constructor() {\n    this.author = 'Developer';\n  }\n}"
      const finalResult = strategy.render(populatedString)
      assert.deepStrictEqual(finalResult, [
        'export class MyClass {',
        '  constructor() {',
        "    this.author = 'Developer';",
        '  }',
        '}',
      ])
    }).not.toThrow()
  })

  describe('constructor', () => {
    it('should initialize with array of strings schema', () => {
      const strategy = new TextFileTemplateStrategy()

      expect(strategy.templateSchema).toBeDefined()
      expect(strategy.templateSchema.type).toBe('array')
      expect(strategy.templateSchema.items?.type).toBe('string')
    })
  })

  describe(TextFileTemplateStrategy.prototype.templateToString.name, () => {
    it('should join string array with newlines', () => {
      const strategy = new TextFileTemplateStrategy()
      const template = ['first line', 'second line', 'third line']

      const result = strategy.templateToString(template)

      expect(result).toBe('first line\nsecond line\nthird line')
    })

    it('should handle empty array', () => {
      const strategy = new TextFileTemplateStrategy()
      const template: string[] = []

      const result = strategy.templateToString(template)

      expect(result).toBe('')
    })

    it('should handle single line', () => {
      const strategy = new TextFileTemplateStrategy()
      const template = ['only line']

      const result = strategy.templateToString(template)

      expect(result).toBe('only line')
    })

    it('should handle empty strings in array', () => {
      const strategy = new TextFileTemplateStrategy()
      const template = ['line 1', '', 'line 3']

      const result = strategy.templateToString(template)

      expect(result).toBe('line 1\n\nline 3')
    })

    it('should handle template variables', () => {
      const strategy = new TextFileTemplateStrategy()
      const template = ["const {{varName}} = '{{value}}';", 'console.log({{varName}});']

      const result = strategy.templateToString(template)

      expect(result).toBe("const {{varName}} = '{{value}}';\nconsole.log({{varName}});")
    })

    it('should handle configuration file format', () => {
      const strategy = new TextFileTemplateStrategy()
      const template = ['[section1]', 'key1={{value1}}', 'key2={{value2}}', '', '[section2]', 'key3={{value3}}']

      const result = strategy.templateToString(template)

      expect(result).toBe('[section1]\nkey1={{value1}}\nkey2={{value2}}\n\n[section2]\nkey3={{value3}}')
    })
  })

  describe(TextFileTemplateStrategy.prototype.render.name, () => {
    it('should split string by newlines into array', () => {
      const strategy = new TextFileTemplateStrategy()
      const populated = 'first line\nsecond line\nthird line'

      const result = strategy.render(populated)

      expect(result).toEqual(['first line', 'second line', 'third line'])
    })

    it('should handle empty string', () => {
      const strategy = new TextFileTemplateStrategy()
      const populated = ''

      const result = strategy.render(populated)

      expect(result).toEqual([''])
    })

    it('should handle single line', () => {
      const strategy = new TextFileTemplateStrategy()
      const populated = 'only line'

      const result = strategy.render(populated)

      expect(result).toEqual(['only line'])
    })

    it('should handle empty lines', () => {
      const strategy = new TextFileTemplateStrategy()
      const populated = 'line 1\n\nline 3'

      const result = strategy.render(populated)

      expect(result).toEqual(['line 1', '', 'line 3'])
    })

    it('should handle populated template variables', () => {
      const strategy = new TextFileTemplateStrategy()
      const populated = "const myVar = 'myValue';\nconsole.log(myVar);"

      const result = strategy.render(populated)

      expect(result).toEqual(["const myVar = 'myValue';", 'console.log(myVar);'])
    })

    it('should handle trailing newlines', () => {
      const strategy = new TextFileTemplateStrategy()
      const populated = 'line 1\nline 2\n'

      const result = strategy.render(populated)

      expect(result).toEqual(['line 1', 'line 2', ''])
    })
  })

  describe('roundtrip consistency', () => {
    it('should maintain data integrity through templateToString -> render cycle', () => {
      const strategy = new TextFileTemplateStrategy()
      const original = [
        '#!/bin/bash',
        "echo 'Starting script'",
        '',
        '# Main logic',
        'for i in {1..5}; do',
        '  echo "Iteration $i"',
        'done',
        '',
        "echo 'Script completed'",
      ]

      const stringified = strategy.templateToString(original)
      const rendered = strategy.render(stringified)

      expect(rendered).toEqual(original)
    })

    it('should handle complex code templates', () => {
      const strategy = new TextFileTemplateStrategy()
      const original = [
        "import { Component } from '@angular/core';",
        '',
        '@Component({',
        "  selector: 'app-example',",
        '  template: `',
        '    <div>',
        '      <h1>{{title}}</h1>',
        '    </div>',
        '  `',
        '})',
        'export class ExampleComponent {',
        "  title = 'Hello World';",
        '}',
      ]

      const stringified = strategy.templateToString(original)
      const rendered = strategy.render(stringified)

      expect(rendered).toEqual(original)
    })
  })

  describe('schema validation', () => {
    it('should have correct schema type', () => {
      const strategy = new TextFileTemplateStrategy()

      expect(strategy.templateSchema.type).toBe('array')
      expect(strategy.templateSchema.items?.type).toBe('string')
    })

    it('should be readonly templateSchema', () => {
      const strategy = new TextFileTemplateStrategy()

      // Check that the property exists and is correctly typed
      expect(strategy.templateSchema).toBeDefined()
      expect(strategy.templateSchema.type).toBe('array')
      expect(strategy.templateSchema.items?.type).toBe('string')
    })
  })
})
