import { assertValidSchema } from '@mono/tschema'
import { Static, TObject, Type } from '@sinclair/typebox'
import { TemplateStrategy } from '../interfaces/TemplateStrategy'
import { TSchema } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

export interface TemplateOptions<TemplateSchema extends TSchema, OptionsSchema extends TObject> {
  readonly strategy: TemplateStrategy<TemplateSchema>
  readonly optionsSchema?: OptionsSchema
  readonly template: Static<TemplateSchema>
}

/**
 * A generic template engine that supports variable substitution using the Strategy pattern.
 * Validates templates and options against TypeBox schemas and renders templates with provided data.
 *
 * Supports mustache-style `{{variable}}` syntax for variable substitution.
 *
 * @example
 * ```typescript
 * const strategy = new StringTemplateStrategy()
 * const optionsSchema = Type.Object({
 *   name: Type.String({ default: 'World' }),
 *   greeting: Type.String({ default: 'Hello' })
 * })
 *
 * const template = new Template({
 *   strategy,
 *   optionsSchema,
 *   template: "{{greeting}} {{name}}!"
 * })
 *
 * const result = template.render({ name: 'TypeScript' })
 * // Returns: "Hello TypeScript!"
 * ```
 */
export class Template<TemplateSchema extends TSchema, OptionsSchema extends TObject> {
  protected readonly strategy: TemplateStrategy<TemplateSchema>
  protected readonly optionsSchema: OptionsSchema
  protected readonly template: Static<TemplateSchema>

  constructor(options: TemplateOptions<TemplateSchema, OptionsSchema>) {
    this.strategy = options.strategy
    this.optionsSchema = options.optionsSchema ?? (Type.Object({}) as OptionsSchema)
    this.template = options.template
    this.strategy.templateSchema.default = this.template
    this.assertValidTemplate()
  }

  /**
   * Returns the template schema with the template set as the default value.
   */
  createSchema(): TemplateSchema {
    return this.strategy.templateSchema
  }

  /**
   * Renders the template with the provided data, returning the result in the template schema format.
   *
   * Variables in the template using `{{variableName}}` syntax are replaced with corresponding
   * values from the data object. Data is validated against the options schema before rendering.
   *
   * @example
   * ```typescript
   * const result = template.render({ name: 'John', age: 30 })
   * ```
   */
  render(data: Static<OptionsSchema> = {}): Static<TemplateSchema> {
    const stringTemplate = this.strategy.templateToString(this.template)
    const merged = Value.Cast(this.optionsSchema, data)
    assertValidSchema(this.optionsSchema, merged, 'Invalid options')
    const populated = stringTemplate.replace(/{{(\w+)}}/g, (_, key) => {
      return String(merged[key])
    })
    return this.strategy.render(populated)
  }

  /**
   * Renders the template and returns the result as a string representation.
   * Convenience method that combines `render()` and `templateToString()`.
   */
  renderString(data: Static<OptionsSchema> = {}): string {
    return this.strategy.templateToString(this.render(data))
  }

  /**
   * Validates that the template contains all variables defined in the options schema.
   *
   * @throws {Error} When a variable defined in the options schema is not found in the template
   */
  protected assertValidTemplate() {
    const string = this.strategy.templateToString(this.template)
    const variables = Object.keys(this.optionsSchema.properties)
    for (const variable of variables) {
      if (!string.includes(`{{${variable}}}`)) {
        throw new Error(`Template does not include variable: ${variable}`)
      }
    }
  }
}
