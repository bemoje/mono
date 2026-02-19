import { Command } from 'commander'
import { execSync } from 'node:child_process'
import { getRepoRootDirpath } from '../../lib/getRepoRootDirpath'
import { timer } from '@mono/node'
import { findWorkspacePackageName } from '../../lib/workspaces'

export function wsCommand() {
  return new Command('ws')
    .alias('w')
    .description('Execute a command within a workspace package using Yarn.')
    .argument('<workspace>', 'Workspace package identifier (name or directory)')
    .argument('<command>', 'Command to execute within the workspace')
    .action(async (workspace: string, command: string) => {
      await timer([workspace, command], async () => {
        const wsPkgName = await findWorkspacePackageName(workspace)
        execSync(`yarn workspace ${wsPkgName} run "${command}"`, {
          stdio: 'inherit',
          cwd: getRepoRootDirpath(),
        })
      })
    })
}
