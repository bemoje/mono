import { $ } from 'execa'
//@ts-expect-error
import escalade from 'https://deno.land/escalade/sync.ts'

const res = escalade(process.cwd(), (dir) => {
  return dir === 'repos'
})
console.log(res)

export async function cliExec(
  command: string,
  options: Parameters<typeof $>[1] & {
    dryRun?: boolean
    quiet?: boolean
    cwd?: string
    silent?: boolean
    debug?: boolean
  } = {}
) {
  const defaults = {
    env: { FORCE_COLOR: 'true' },
    preferLocal: true,
    lines: true,
    // reject: false,
    // detatch: true,
  }

  if (options.debug) {
    console.debug(`Executing command: ${command}`)
    console.debug(`defaults:`, defaults)
    console.debug(`options:`, { defaults, options })
  }

  const merged = {
    ...defaults,
    ...options,

    verbose: options.debug ? 'full' : 'none',
    silent: options.silent && !options.debug,
    quiet: (options.quiet || options.silent) && !options.debug,

    stdout: options.debug ? 'inherit' : options.silent ? 'ignore' : options.quiet ? 'pipe' : 'inherit',
    stderr: options.debug ? 'inherit' : options.silent ? 'ignore' : options.quiet ? 'pipe' : 'inherit',
    cwd: options.cwd ?? process.cwd(),
  } as const

  if (options.dryRun) {
    if (!options.quiet) {
      console.log(`dryRun enabled. Skipping command: ${command}`)
    }
    return
  }

  await $(command, merged)
}
