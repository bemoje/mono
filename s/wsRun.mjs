/**
 * Executes a command within a specified workspace package in a monorepo using Yarn.
 *
 * This script takes two command-line arguments:
 * 1. The workspace package identifier (name or directory)
 * 2. The command to execute within that workspace
 *
 * The script:
 * - Finds the full package name based on the provided identifier
 * - Executes the command within that workspace using Yarn's workspace feature
 * - Times the execution and logs the duration
 * - Runs the command with stdio inherited, allowing for interactive commands
 */
import { execSync } from 'child_process'
import { getRepoRootDirpath } from './util/getRepoRootDirpath.mjs'
import { timer } from './util/timer.mjs'
import { findWorkspacePackageName } from './util/findWorkspacePackageName.mjs'

await timer([process.argv[2], process.argv[3]], async (log) => {
  const wsPkgName = await findWorkspacePackageName(process.argv[2])
  const cmd = process.argv[3]
  execSync(`yarn workspace ${wsPkgName} run "${cmd}"`, {
    stdio: 'inherit',
    cwd: getRepoRootDirpath(),
  })
})
