import { Static, TObject, Type } from '@sinclair/typebox'
import { TemplateStrategy } from '../interfaces/TemplateStrategy'

/**
 * Template strategy for handling JSON file templates with structured object schemas.
 *
 * Converts structured objects to formatted JSON strings and parses JSON strings
 * back to typed objects. Uses pretty-printing with 2-space indentation for
 * human-readable output.
 *
 * @template Schema - Object schema type extending TObject, defaults to empty object
 */
export class JsonFileTemplateStrategy<Schema extends TObject = TObject> implements TemplateStrategy<Schema> {
  readonly templateSchema: Schema

  /**
   * Creates a JSON file template strategy with optional schema validation.
   *
   * @param templateSchema - TypeBox object schema for template validation.
   *                        Defaults to empty object schema if not provided.
   */
  constructor(templateSchema?: Schema) {
    this.templateSchema = templateSchema ?? (Type.Object({}) as Schema)
  }

  /**
   * Converts a template object to pretty-printed JSON string.
   */
  templateToString(template: Static<Schema>): string {
    return JSON.stringify(template, null, 2)
  }

  /**
   * Parses JSON string back to typed object conforming to schema.
   */
  render(populated: string): Static<Schema> {
    return JSON.parse(populated)
  }
}
