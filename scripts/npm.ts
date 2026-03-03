import colors from 'ansi-colors'
import fs from 'fs-extra'
import { prompt } from '@mono/prompt'
import { spawnChildProcess } from '@mono/node'
import stringArgv from 'string-argv'
import { uniq } from 'es-toolkit/array'

const pkg = await fs.readJson('./package.json')

const keys = Object.keys(pkg.scripts || {})
const padLen =
  Math.max(
    ...keys.map((k) => {
      return k.length
    })
  ) + 3

let exit = false

const builder = prompt
  .search('script') //
  .choices(keys)
  .filtering({ includes: true, startsWith: true, caseSensitive: true })
  .clearFirst(true)
  .limit(process.stdout.rows ? Math.max(process.stdout.rows - 5, 5) : 50)
  .searchStopSequence(' -- ')
  .name('yarn')
  .preRender((parsed) => {
    return parsed.map((part) => {
      let descr = pkg.scripts?.[part] ?? ('' as string)
      if (!descr) {
        return part
      }
      const padded = part.padEnd(padLen, ' ')
      const width = padLen + descr.length + 6
      const termWidth = process.stdout.columns || 80
      if (width > termWidth) {
        const available = termWidth - padLen - 5 - 6
        descr = descr.length > available ? `${descr.slice(0, available)} (...)` : descr
      }
      return padded + colors.gray.dim(descr)
    })
  })
  .onState((state) => {
    if (state.aborted || state.exited) {
      exit = true
    }
  })

const res = await builder.run()

if (exit) {
  process.exit(0)
}

const metadata = res.metadata
const args = metadata.inputAfterStop?.replace(/^\s?--\s+/, '').trim() || ''
const isSingleSelection = res.selected && res.selected !== '>>'
const selection = isSingleSelection ? [res.selected] : res.matches
const cmds = selection.map((cmd) => {
  return uniq(
    ['yarn', cmd, args]
      .map((s) => {
        return s.trim()
      })
      .filter(Boolean)
  ).join(' ')
})

if (selection.length === keys.length && !args) {
  process.exit(0)
}

cmds.forEach((cmd) => {
  console.log('>', cmd)
})

const msg = cmds.length > 1 ? `Run all of the above commands?` : `Run the above command?`
const confirmed = await prompt
  .confirm(msg)
  .initial(true)
  .onState((state) => {
    if (state.aborted || state.exited) {
      process.exit(0)
    }
  })
  .run()

if (confirmed) {
  for (const cmd of cmds) {
    console.log()
    console.log('>', cmd)

    const args = stringArgv(cmd)
    const program = args.shift()!
    // console.log({ program, args })

    process.exitCode ??= await spawnChildProcess(program, args, {
      stdio: 'inherit', //
      shell: true,
    }).catch(() => {
      return 1
    })

    if (process.exitCode) {
      break
    }
  }
}
