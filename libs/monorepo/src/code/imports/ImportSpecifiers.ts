import { CodeBlock } from '../CodeBlock'
import { ImportStatement } from './ImportStatement'
import { Inspector, Parenting } from '@mono/composition'

@Parenting.compose
export class ImportSpecifiers<P extends ImportStatement = ImportStatement> extends CodeBlock<P> {
  static readonly inspector = Inspector.compose(ImportSpecifiers, {
    keys: ['import', 'type'],
    autoAddBooleanKeys: false,
  })

  get codeWithoutTypeKeyword() {
    return this.code.replace(/[\s]*\btype\b[\s]*/g, ' ')
  }

  get type(): 'default' | 'named' | 'mixed' | 'namespace' | 'sideEffect' | 'unknown' {
    if (this.isNamedImport) return 'named'
    if (this.isNamespaceImport) return 'namespace'
    if (this.isMixedImport) return 'mixed'
    if (this.isSideEffectImport) return 'sideEffect'
    if (this.isDefaultImport) return 'default'
    throw new Error('Unknown import specifier type. Code:\n' + this.codeWithoutTypeKeyword)
  }

  get isDefaultImport() {
    return /[a-zA-Z_$][\w$]*/.test(this.codeWithoutTypeKeyword) && !this.isNamespaceImport
  }

  get isNamedImport() {
    return /\{[^}]+\}/.test(this.codeWithoutTypeKeyword)
  }

  get isMixedImport() {
    return /([a-zA-Z_$][\w$]*),\s*\{[^}]+\}/.test(this.codeWithoutTypeKeyword)
  }

  get isNamespaceImport() {
    return /\*\s+as\s+([a-zA-Z_$][\w$]*)/.test(this.codeWithoutTypeKeyword)
  }

  get isSideEffectImport() {
    return /^$/.test(this.codeWithoutTypeKeyword)
  }

  get namedImportsArray(): string[] {
    return (
      this.code
        .replace('\n', ' ')
        .match(/\{([^}]+)\}/)?.[1]
        .split(',')
        .map((specifier) => specifier.trim())
        .filter((s) => !!s) || []
    )
  }

  /**
   * Splits the import specifier into an array of specifiers as if to split into individual import statements.
   * @example `{A,B} => {A},{B}`
   */
  splitSpecifiers() {
    return this.isNamedImport
      ? this.namedImportsArray.map((n) => {
          return this.code.startsWith('type ') ? 'type ' + `{ ${n} }` : `{ ${n} }`
        })
      : [this.code]
  }

  /**
   * Returns the keys added to the global namespace by this import specifier.
   */
  get importedNamesArray() {
    return this.codeWithoutTypeKeyword
      .replace(/[\w*]+ as \w+/, (m) => m.split(' as ')[1] || '')
      .replace(/[{}]/g, ' ')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  }

  get defaultImport() {
    return this.codeWithoutTypeKeyword.match(/^([a-zA-Z_$][\w$]*)\s*(,|)/)?.[1] || undefined
  }

  get namespaceImport() {
    return this.codeWithoutTypeKeyword.match(/^\*\s+as\s+([a-zA-Z_$][\w$]*)/)?.[1] || undefined
  }

  get sideEffectImport() {
    return this.codeWithoutTypeKeyword.match(/^['"]([^'"]+)['"]/)?.[1] || undefined
  }

  get hasNamedImport() {
    return !!this.namedImportsArray.length
  }

  get hasDefaultImport() {
    return !!this.defaultImport
  }
}
