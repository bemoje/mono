import { MonoRepo } from '@mono/monorepo'

const withNodeDeps = [] as [string, string[]][]
const withoutNodeDeps = [] as [string, string[]][]

new MonoRepo().workspaces.forEach((ws) => {
  const deps = Array.from(
    new Set(
      ws.tsFiles
        .filter((f) => f.isSourceFile)
        .map((f) => {
          return f.tsCode.imports.filter((i) => i.module.isBuiltin).map((i) => i.split
        })
        .flat(3),
    ),
  )

  if (deps.length) {
    withNodeDeps.push([ws.name, deps])
  } else {
    withoutNodeDeps.push([ws.name, deps])
  }
})

console.log('Native built-in node dependencies:')
withNodeDeps.forEach(([name, deps]) => {
  console.log(name, deps)
})
console.log('------')
withoutNodeDeps.forEach(([name, deps]) => {
  console.log(name, deps)
})
