import { SpawnOptions } from 'child_process'
import cp from 'child_process'
import { spawnChildProcess } from './spawnChildProcess'

/**
 * Spawn a child node process.
 * @param callback Callback just to make the ChildProcess object available.
 */
export async function spawnNodeProcess(
  args: string[] = [],
  spawnOptions: SpawnOptions = {},
  emitterCallback?: (child: cp.ChildProcess) => void,
): Promise<number> {
  return await spawnChildProcess(getNodeExecPath(), args.slice(), spawnOptions, emitterCallback)
}

/**
 * Using child_process.spawn to start a node process works differently on windows and non-windows systems.
 * This returns the correct path to the node binary path for the host OS.
 */
function getNodeExecPath() {
  return process.platform === 'win32' ? process.execPath : process.argv[0]
}
