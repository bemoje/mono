import { Static, TArray, TString, Type } from '@sinclair/typebox'
import { TemplateStrategy } from '../interfaces/TemplateStrategy'

/**
 * Template strategy for handling multi-line text file templates.
 *
 * Converts arrays of strings to newline-separated text and parses text files
 * back to string arrays by splitting on newlines. Ideal for processing
 * configuration files, scripts, or any line-based text content.
 */
export class TextFileTemplateStrategy implements TemplateStrategy<TArray<TString>> {
  readonly templateSchema = Type.Array(Type.String())

  /**
   * Joins string array into newline-separated text.
   */
  templateToString(template: Static<TArray<TString>>): string {
    return template.join('\n')
  }

  /**
   * Splits text content into string array by newlines.
   */
  render(populated: string): Static<TArray<TString>> {
    return populated.split('\n')
  }
}
