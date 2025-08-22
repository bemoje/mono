import { Static, TSchema } from '@sinclair/typebox'

/**
 * Strategy interface for template processing operations.
 *
 * @template TemplateSchema - The schema type that defines the structure of templates,
 *                           must extend TSchema.
 */
export interface TemplateStrategy<TemplateSchema extends TSchema> {
  /**
   * The schema definition for templates handled by this strategy.
   */
  readonly templateSchema: TemplateSchema

  /**
   * Converts a template object to its string representation.
   *
   * @param template - The template object conforming to the template schema
   * @returns The string representation of the template
   */
  templateToString(template: Static<TemplateSchema>): string

  /**
   * Renders a populated template string back into a structured template object.
   *
   * @param populated - The populated template string
   * @returns The structured template object that conforms to the template schema
   */
  render(populated: string): Static<TemplateSchema>
}
