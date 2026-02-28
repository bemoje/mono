import { AbstractBase } from '@mono/monorepo'
import { AbstractCode } from '@mono/monorepo'
import { CodeBlock } from '@mono/monorepo'
import { ImportKeywords } from '@mono/monorepo'
import { ImportSpecifiers } from '@mono/monorepo'
import { ImportStatement } from '@mono/monorepo'
import { ModuleSpecifier } from '@mono/monorepo'
import { MonoRepo } from '@mono/monorepo'
import { Profiler } from '@mono/profiler'
import { TsCode } from '@mono/monorepo'
import { TsFile } from '@mono/monorepo'
import { Workspace } from '@mono/monorepo'
import fs from 'fs'
// Profiler.class(Inspector)
// Profiler.class(Parenting)
// Profiler.class(ParentRelationTypes)
import path from 'path'

Profiler.module(path, 'path')
Profiler.module(fs, 'fs')

Profiler.class(AbstractBase)
Profiler.class(AbstractCode)
Profiler.class(CodeBlock)
Profiler.class(ImportKeywords)
Profiler.class(ImportSpecifiers)
Profiler.class(ImportStatement)
Profiler.class(ModuleSpecifier)
Profiler.class(TsCode)
Profiler.class(TsFile)
Profiler.class(Workspace)
Profiler.class(MonoRepo)

// console.log(
Object.fromEntries(
  new MonoRepo().workspaces.map((ws) => {
    return [ws.name, ws.importedDependenciesRecursive]
  }),
)
// )

// ParentRelationTypes.printAllStats()

Profiler.printResults()
