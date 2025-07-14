import { Static, TString, Type } from '@sinclair/typebox'
import { TemplateStrategy } from '../interfaces/TemplateStrategy'

/**
 * Template strategy for handling simple string templates.
 *
 * Provides pass-through behavior for string templates where the template
 * and rendered output are both plain strings. Useful for text-based templates
 * that don't require parsing or complex structure.
 */
export class StringTemplateStrategy implements TemplateStrategy<TString> {
  readonly templateSchema = Type.String()

  /**
   * Returns the template string as-is (pass-through).
   */
  templateToString(template: Static<TString>): string {
    return template
  }

  /**
   * Returns the populated string as-is (pass-through).
   */
  render(populated: string): Static<TString> {
    return populated
  }
}
