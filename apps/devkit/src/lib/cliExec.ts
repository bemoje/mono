import { $ } from 'execa'

export async function cliExec(
  command: string,
  opts: Parameters<typeof $>[1] & {
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

  if (opts.debug) {
    console.debug(`Executing command: ${command}`)
    console.debug(`defaults:`, defaults)
    console.debug(`options:`, { defaults, opts })
  }

  const merged = {
    ...defaults,
    ...opts,

    verbose: opts.debug ? 'full' : 'none',
    silent: opts.silent && !opts.debug,
    quiet: (opts.quiet || opts.silent) && !opts.debug,

    stdout: opts.debug ? 'inherit' : opts.silent ? 'ignore' : opts.quiet ? 'pipe' : 'inherit',
    stderr: opts.debug ? 'inherit' : opts.silent ? 'ignore' : opts.quiet ? 'pipe' : 'inherit',
    cwd: opts.cwd ?? process.cwd(),
  } as const

  if (opts.dryRun) {
    if (!opts.quiet) {
      console.log(`dryRun enabled. Skipping command: ${command}`)
    }
    return
  }

  await $(command, merged)
}
