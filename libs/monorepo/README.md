# @mono/monorepo

Monorepo workspace management, package discovery, and TypeScript code processing utilities.

[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Module](https://img.shields.io/badge/Module-ESM-yellow)](https://nodejs.org/api/esm.html)

## Usage

### Managing the Repository & Workspaces

The `MonoRepo` class allows structured, automated tasks against packages and workspaces in a typical monorepo
environment (e.g. yarn, npm, pnpm workspaces).

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

## API Reference

### Core Repository

| Export         | Description                                                |
| -------------- | ---------------------------------------------------------- |
| `MonoRepo`     | Central class governing the structure of an open monorepo  |
| `Workspace`    | Model structure for an individual project/package          |
| `AbstractBase` | Foundational primitive used for components mapping classes |

### Code & Imports Parsing

| Export             | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| `AbstractCode`     | Model providing baseline AST context matching              |
| `TsCode`           | Encapsulates structural elements found in Typescript code  |
| `CodeBlock`        | Abstraction representing code blocks and nested structures |
| `ImportStatement`  | Comprehensive model for evaluating module imports          |
| `ImportKeywords`   | Parsed model mapping distinct words injected               |
| `ImportSpecifiers` | Parsed model resolving named exports inside imports        |
| `ModuleSpecifier`  | Model resolving targeted module representations            |

### File Operations

| Export     | Description                                                |
| ---------- | ---------------------------------------------------------- |
| `File`     | Generic cross-platform file wrapper providing baseline IO  |
| `TsFile`   | File abstraction built specifically for `.ts` processing   |
| `TestFile` | Standard test-execution tracking class wrapping code types |

### Discovery Methods

| Export                            | Description                                               |
| --------------------------------- | --------------------------------------------------------- |
| `getRepoRootDirpath`              | Find the repository's root execution configuration index  |
| `getRepoPackageJsonPath`          | Absolute path to root `package.json`                      |
| `getRepoPackageJson`              | Full structurally parsed data for root `package.json`     |
| `getWorkspaceDirpaths`            | Retrieve array of directories containing active packages  |
| `getAllWorkspacePaths`            | Return specific mapped configurations of standard domains |
| `getAllWorkspacePackageJsonPaths` | Array returning strictly active `package.json` paths      |
| `getAllWorkspacePackageJsons`     | Extract parsing configuration objects for children pkgs   |
| `getAllWorkspacePackageNames`     | Map name attributes found from all workspace directories  |
| `findWorkspacePackageName`        | Discover closest named active project bound to child path |

### Utilities

| Export                              | Description                                                |
| ----------------------------------- | ---------------------------------------------------------- |
| `getAllImports`                     | Collect import arrays across scopes / boundaries           |
| `resolveModuleImportPath`           | Convert abstract module statements into absolute locations |
| `semverVersionBump`                 | Upgrade semantics targeting specific boundaries semver     |
| `hasExtnamePrefix`                  | Matching abstraction targeting specific semantic models    |
| `SemanticExtnamePrefix`             | Types identifying standard TS suffix standards (`.test`)   |
| `SemanticExtnamePrefixes`           | Array evaluation tracking suffixes expected across modules |
| `SemanticExtnamePrefixDescriptions` | Readable text models matching semantic prefix usages       |
