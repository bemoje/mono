import cp, { SpawnOptions } from 'child_process'

/**
 * Spawn a child process.
 * @param callback Callback just to make the ChildProcess object available.
 */
export function spawnChildProcess(
  binaryPath: string,
  args: string[] = [],
  spawnOptions: SpawnOptions = {},
  callback?: (child: cp.ChildProcess) => void,
): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      const child = cp.spawn(binaryPath, args, spawnOptions)
      child.on('error', reject)
      child.on('exit', (code, signal) => {
        if (!code) resolve(0)
        reject(
          new Error(`Child node process exited with code: ${code}, signal: ${signal}, argv: [${args.join(', ')}]`),
        )
      })
      if (callback) callback(child)
    } catch (error) {
      reject(error)
    }
  })
}
