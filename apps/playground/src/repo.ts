import { MonoRepo } from '@mono/monorepo'

const repo = new MonoRepo()

const ws = repo.workspaces.find((ws) => ws.name.split('/').pop() === 'monorepo')
const deps = ws?.importedDependencies

console.log(deps)
