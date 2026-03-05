import { importStatementToFormattedOneLiner } from './importStatementToFormattedOneLiner'
import { isBuiltin } from 'node:module'
import { rexec } from '@mono/regex'
import upath from 'upath'

/**
 * Parses an import statement into its constituent parts for detailed analysis.
 * This function breaks down an import statement into keywords, specifiers, module path,
 * and other components, providing a comprehensive analysis of the import structure.
 * @param statement - The import statement string to parse
 * @returns An ImportStatementParser instance with parsed components and utility methods
 * @example
 * ```typescript
 * const parsed = parseImportStatement("import type { Foo, Bar as Baz } from './module'")
 * console.log(parsed.type) // 'named'
 * console.log(parsed.keywords.hasTypeKeyword) // true
 * console.log(parsed.modulePath.type) // 'relative'
 * console.log(parsed.getNames()) // ['Foo', 'Baz']
 * ```
 */
export function parseImportStatement(
  statement: string,
  options?: { isWorkspacePath?: (p: string) => boolean }
): ImportStatement {
  const code = statement
  const oneliner = importStatementToFormattedOneLiner(code)

  const groups = rexec(
    /^(?<keywords>import +(?<type>type)? *)(?<specifiers>.*? ?)?(?<mod>(?:from ?)?(?<quote>["'`])(?<path>.*?)\5(?<semi>;?))$/g,
    oneliner
  )[0].groups!

  const keywords: ImportKeywords = {
    code: groups.keywords!,
    keywords: groups.keywords.trim().split(/\s+/g),
    hasTypeKeyword: !!groups.type,
  }

  const specifiers: ImportSpecifiers = {
    code: groups.specifiers || '',
    children: ((specifiers?: string) => {
      const children = [] as ImportSpecifier[]

      if (!specifiers) {
        return children
      }

      children.push(
        ...specifiers
          .replace(/{[^}]+}/, '')
          .split(',')
          .map((s) => {
            return s.trim()
          })
          .filter((s) => {
            return !!s
          })
          .map((code) => {
            return {
              code: code.trim(),
              type: code.trim().startsWith('* as ') ? ('namespace' as const) : ('default' as const),
              name: code.replace('* as ', '').trim(),
              isType: keywords.hasTypeKeyword || /\btype /.test(code),
            }
          })
      )

      children.push(
        ...(specifiers.match(/{([^}]+)}/)?.[1] || '')
          .split(',')
          .filter((s) => {
            return !!s.trim()
          })
          .map((code) => {
            return {
              code: code.trim(),
              type: 'named' as const,
              name: code.replace(/ as \w+\b/, '').trim(),
              isType: keywords.hasTypeKeyword || /\btype /.test(code),
            }
          })
          .map((o) => {
            if (o.isType && !o.name.startsWith('type ')) {
              o.name = `type ${o.name}`
            }
            return o
          })
      )

      return children
    })(groups.specifiers),
  }

  const modulePath: ImportModulePath = {
    code: groups.mod!,
    type: ((): ImportPathType => {
      const p = groups.path!
      return (
        options?.isWorkspacePath?.(p) ? 'workspace'
        : upath.isAbsolute(p) ? 'absolute'
        : p.startsWith('.') ? 'relative'
        : isBuiltin(p) ? 'builtin'
        : 'package'
      )
    })(),
    quote: groups.quote!,
    path: groups.path!,
  }

  const type =
    specifiers.children.length === 0 ? 'sideEffect'
    : specifiers.children.length === 1 && specifiers.children[0].type === 'default' ? 'default'
    : specifiers.children.length === 1 && specifiers.children[0].type === 'namespace' ? 'namespace'
    : (
      specifiers.children.length > 0
      && specifiers.children.filter((s) => {
        return s.type === 'named'
      }).length === specifiers.children.length
    ) ?
      'named'
    : 'mixed'

  const semi = groups.semi || ''

  return new ImportStatementParser(code, oneliner, type, keywords, specifiers, modulePath, semi)
}

class ImportStatementParser implements ImportStatement {
  constructor(
    readonly code: string,
    readonly oneliner: string,
    readonly type: ImportStatementType,
    readonly keywords: ImportKeywords,
    readonly specifiers: ImportSpecifiers,
    readonly modulePath: ImportModulePath,
    readonly semi: string
  ) {}

  /**
   * The names that this import statement declares in the global namespace.
   */
  getNames(options?: { unaliasNamedImports?: boolean }) {
    return this.splitBySpecifier(options).flatMap((ins) => {
      return ins.specifiers.children
        .map((s) => {
          return s.type === 'named' && options?.unaliasNamedImports ?
              s.code.replaceAll(/ as \w+/g, '')
            : s.code.replaceAll(/[\w*]+ as /g, '')
        })
        .filter(Boolean)
    })
  }

  /**
   * Split the import statement into as many individual import statements as possible.
   */
  splitBySpecifier(options?: { unaliasNamedImports?: boolean }): ImportStatementParser[] {
    return this.type === 'sideEffect' ?
        [this]
      : this.specifiers.children.map((s) => {
          const code =
            s.type === 'named' && options?.unaliasNamedImports ? s.code.replaceAll(/ as \w+/g, '') : s.code
          return parseImportStatement(
            importStatementToFormattedOneLiner(
              this.oneliner
                .replace(this.specifiers.code, s.type === 'named' ? `{ ${code} } ` : `${code} `)
                .replace(/{ *type /, this.keywords.hasTypeKeyword ? '{ ' : 'type { ')
            ).replace('type { ', '{ type ')
          )
        })
  }
}

/**
 * The type of path used in an import statement.
 */
type ImportPathType = 'relative' | 'absolute' | 'builtin' | 'package' | 'workspace'

/**
 * The type of import specifier.
 */
type ImportSpecifierType = 'default' | 'namespace' | 'named'

/**
 * The overall type of import statement based on its specifiers.
 */
type ImportStatementType = 'default' | 'namespace' | 'named' | 'sideEffect' | 'mixed'

/**
 * Represents the keywords portion of an import statement (e.g., 'import type').
 */
interface ImportKeywords {
  /** The raw code containing the keywords */
  code: string
  /** Array of individual keywords */
  keywords: string[]
  /** Whether the 'type' keyword is present */
  hasTypeKeyword: boolean
}

/**
 * Represents a single import specifier (e.g., a named import, default import, etc.).
 */
interface ImportSpecifier {
  /** The raw code for this specifier */
  code: string
  /** The type of this specifier */
  type: ImportSpecifierType
  /** The name being imported */
  name: string
  /** Whether this is a type-only import */
  isType: boolean
}

/**
 * Represents the collection of specifiers in an import statement.
 */
interface ImportSpecifiers {
  /** The raw code containing all specifiers */
  code: string
  /** Array of individual specifiers */
  children: ImportSpecifier[]
}

/**
 * Represents the module path portion of an import statement.
 */
interface ImportModulePath {
  /** The raw code containing the module path */
  code: string
  /** The type of path (relative, absolute, builtin, package) */
  type: ImportPathType
  /** The quote character used (' or " or `) */
  quote: string
  /** The actual path string */
  path: string
}

/**
 * Interface representing a parsed import statement with all its components.
 * This interface enforces consistent structure for analyzing and manipulating
 * import statements in TypeScript source files.
 */
export interface ImportStatement {
  /** The original import statement code */
  readonly code: string
  /** The import statement as a formatted single line */
  readonly oneliner: string
  /** The type of import statement */
  readonly type: ImportStatementType
  /** The keywords used in the import statement */
  readonly keywords: ImportKeywords
  /** The import specifiers */
  readonly specifiers: ImportSpecifiers
  /** The module path information */
  readonly modulePath: ImportModulePath
  /** The semicolon at the end, if present */
  readonly semi: string

  /**
   * Split the import statement into as many individual import statements as possible.
   * @param options - Configuration options for splitting
   * @param options.unaliasNamedImports - Whether to remove aliases from named imports
   * @returns Array of individual import statements
   */
  splitBySpecifier(options?: { unaliasNamedImports?: boolean }): ImportStatement[]

  /**
   * Returns a sorted array of unique names that this import statement declares in the global namespace.
   * @param options - Configuration options for name extraction
   * @param options.unaliasNamedImports - Whether to remove aliases from named imports
   * @returns Array of declared names
   */
  getNames(options?: { unaliasNamedImports?: boolean }): string[]
}
