# @mono/monorepo

Monorepo workspace management, package discovery, and TypeScript code processing utilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/) [![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Exports

<!-- EXPORTS_START -->

- [**AbstractBase**](./src/common/AbstractBase.ts): Abstract base class that provides common functionality for monorepo management including parenting and inspection capabilities.
- [**AbstractCode**](./src/code/AbstractCode.ts): Abstract base class for representing code structures in the monorepo with inspection and preview capabilities.
- [**CodeBlock**](./src/code/CodeBlock.ts): Represents a block of code within a larger code structure, defined by an index range.
- [**File**](libs/config/src/core/ConfigFile.ts): Represents a file in a workspace with various utility methods to check file types and read contents.
- [**ImportKeywords**](./src/code/imports/ImportKeywords.ts): Represents the imported keywords/specifiers in an import statement.
- [**ImportSpecifiers**](./src/code/imports/ImportSpecifiers.ts): Represents and analyzes import specifiers in TypeScript/JavaScript code. This class parses and categorizes different types of import statements such as default imports, named imports, namespace imports, mixed imports, and side effect imports. It provides methods to retrieve specific parts of import statements and to manipulate them.
- [**ImportStatement**](./src/code/imports/ImportStatement.ts): Represents an import statement in TypeScript code with parsing and manipulation capabilities.
- [**ModuleSpecifier**](./src/code/imports/ModuleSpecifier.ts): Represents a module specifier in an import statement. Module specifiers are the strings that indicate where to import from, such as './path/to/file', '
- [**MonoRepo**](./src/MonoRepo.ts): Represents a monorepo with workspace management, TypeScript configuration, and dependency analysis capabilities.
- [**SemanticExtnamePrefix**](./src/util/SemanticExtnamePrefix.ts): Constants for semantic filename prefixes used to categorize files by their purpose.
- [**SemanticExtnamePrefixDescriptions**](./src/util/SemanticExtnamePrefixDescriptions.ts): A record mapping semantic extname prefixes to their descriptions. - `d`: Declaration files - `test`: Vitest test suite files - `examples`: Files containing working and tested example usage code (included in git, but ignored by most repo tools) - `benchmark`: Benchmark files (included in git, but ignored by most repo tools) - `temp`: Temporary files (ignored by git, build, tests, etc.) - `wip`: Work in progress files (ignored by git, build, tests, etc.)
- [**TestFile**](./src/file/TestFile.ts): Represents a test file in the monorepo with TypeScript code analysis capabilities.
- [**TsCode**](./src/code/TsCode.ts): Represents TypeScript code with import parsing and manipulation capabilities.
- [**TsFile**](./src/file/TsFile.ts): Represents a TypeScript file in the monorepo with code analysis and dependency tracking capabilities.
- [**Workspace**](./src/repo/Workspace.ts): Represents a workspace within a monorepo, providing functionality to analyze and manage workspace dependencies. A workspace is a directory containing a package.json file and typically source code files. This class provides methods and properties for analyzing: - Source and test files in the workspace - Dependencies declared in package.json - Dependencies imported in source and test files - Missing, unused, and incorrectly imported dependencies
- [**findWorkspacePackageName**](./src/methods/findWorkspacePackageName.ts): Finds the full package name for a workspace given a partial name.
- [**getAllImports**](./src/methods/getAllImports.ts): Retrieves all import statements from TypeScript source files across all workspaces in the monorepo.
- [**getAllWorkspacePackageJsonPaths**](./src/methods/getAllWorkspacePackageJsonPaths.ts): Gets all workspace package.json file paths.
- [**getAllWorkspacePackageJsons**](./src/methods/getAllWorkspacePackageJsons.ts): Gets all workspace package.json contents.
- [**getAllWorkspacePackageNames**](./src/methods/getAllWorkspacePackageNames.ts): Gets all workspace package names.
- [**getAllWorkspacePaths**](./src/methods/getAllWorkspacePaths.ts): Returns an array of all workspace directory paths.
- [**getImportsRecursively**](./src/methods/getImportsRecursively.ts): Recursively retrieves all imports for the given entry points, categorizing them into external, builtin, and internal dependencies.
- [**getRepoPackageJson**](./src/methods/getRepoPackageJson.ts): Reads the repository's root package.json file.
- [**getRepoPackageJsonPath**](./src/methods/getRepoPackageJsonPath.ts): Gets the absolute path to the repository's package.json file.
- [**getRepoRootDirpath**](./src/util/getRepoRootDirpath.ts): Get the root directory path of the monorepo by finding the package.json with workspaces configuration.
- [**getWorkspaceDirpaths**](./src/util/getWorkspaceDirpaths.ts): Get all workspace directory paths by reading the workspace patterns from the root package.json.
- [**hasExtnamePrefix**](./src/util/hasExtnamePrefix.ts): Checks if a file path has any of the specified semantic extension prefixes (e.g., .test.ts).
- [**resolveModuleImportPath**](./src/util/resolveModuleImportPath.ts): Returns the resolved import path (relative from repo root)
- [**semverVersionBump**](./src/util/semverVersionBump.ts): Bumps the semantic versioning (SemVer) of a given version string or array based on the specified level. The function supports 'major', 'minor', and 'patch' levels.

<!-- EXPORTS_END -->

## Usage

### Managing the Repository & Workspaces

The `MonoRepo` class allows structured, automated tasks against packages and workspaces in a typical monorepo environment (e.g. yarn, npm, pnpm workspaces).

```ts
import { MonoRepo } from '@mono/monorepo'

const repo = new MonoRepo()

// Access all registered packages/workspaces
const workspaces = repo.workspaces
console.log(`Found ${workspaces.length} workspaces`)

// Get specific workspaces by name or type
const packageJson = repo.getWorkspace('my-package')?.packageJson

// Bump version for all packages (semver)
repo.bumpVersions('patch')
```

### Script & File Operations

```ts
import { TsFile, findWorkspacePackageName } from '@mono/monorepo'

const tsFile = new TsFile('path/to/my-file.ts')

// Read structural code representations (imports, blocks, components)
const imports = tsFile.imports

// Use utility functions independently of classes
const packageName = findWorkspacePackageName('libs/my-feature')
```
