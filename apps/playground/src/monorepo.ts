import { AbstractBase } from '@mono/monorepo'
import { AbstractCode } from '@mono/monorepo'
import { CodeBlock } from '@mono/monorepo'
import { ImportKeywords } from '@mono/monorepo'
import { ImportSpecifiers } from '@mono/monorepo'
import { ImportStatement } from '@mono/monorepo'
import { Inspector, Parenting, ParentRelationTypes } from '@mono/composition'
import { ModuleSpecifier } from '@mono/monorepo'
import { MonoRepo } from '@mono/monorepo'
import { Profiler } from '@mono/profiler'
import { TsCode } from '@mono/monorepo'
import { TsFile } from '@mono/monorepo'
import { Workspace } from '@mono/monorepo'

Profiler.class(Inspector)

Profiler.class(Parenting)
Profiler.class(ParentRelationTypes)

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

const repo = new MonoRepo()

repo.inspector.toObject()
// fs.writeJsonSync('apps/playground/src/lib/monorepo.ts.json', repo.inspector.toObject(), { spaces: 2 })

repo.workspaces.splice(1, repo.workspaces.length)
console.log(repo.inspector.inspect())

ParentRelationTypes.printAllStats()

Profiler.printResults()
