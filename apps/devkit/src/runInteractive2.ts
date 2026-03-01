import type { Command } from '@mono/cli'
import { CommandSearchPrompt } from './CommandSearchPrompt'
import { DONE_VALUE } from './CommandSearchPrompt'
import type { Option } from '@mono/cli'
import colors from 'ansi-colors'
import fs from 'fs-extra'
import { getCommandAndAncestors } from '@mono/cli'
import { prompt } from '@mono/prompt'
import stringArgv from 'string-argv'

async function promptOptionValue(opt: Option, argv: string[]) {
  console.log()
  console.log(
    colors.blue(opt.flags),
    colors.gray(opt.description ?? ''),
    opt.defaultValue !== undefined ? colors.gray(`(default: ${opt.defaultValue})`) : ''
  )

  if (opt.variadic && opt.choices?.length) {
    await prompt
      .autocompleteMultiselect(argv.join(' '))
      .name(opt.name)
      .instructions('')
      .optionsPerPage(50)
      .choices(opt.choices!)
      .run({
        onSubmit: (_, selected) => {
          selected = [selected ?? []].flat(2)
          const values = selected
            .map((s: string) => {
              return s.trim()
            })
            .filter(Boolean)
          if (values.length) {
            argv.push(`--${opt.long}`, ...values)
          }
        },
      })
  } else if (opt.variadic) {
    await prompt
      .text(argv.join(' '))
      .name(opt.name)
      .run({
        onSubmit: (_, answer) => {
          const value = answer?.trim() ?? ''
          if (value) {
            stringArgv(value, 'node')
              .filter(Boolean)
              .forEach((v) => {
                argv.push(`--${opt.long}`, v)
              })
          }
        },
      })
  } else if (opt.choices?.length) {
    await prompt
      .search(argv.join(' '))
      .name(opt.name)
      .clearFirst(true)
      .choices(opt.choices!)
      .limit(50)
      .run({
        onSubmit: (_, answer) => {
          const value = answer?.trim() ?? ''
          if (value) {
            argv.push(`--${opt.long}`, value)
          }
        },
      })
  } else {
    await prompt
      .text(argv.join(' '))
      .name(opt.name)
      .run({
        onSubmit: (_, answer) => {
          const value = answer.trim()
          if (value) {
            argv.push(`--${opt.long}`, value)
          }
        },
      })
  }
}

// eslint-disable-next-line max-lines-per-function, @typescript-eslint/no-explicit-any
export async function runInteractive2<T extends Command<any, any, any>>(cli: T) {
  const pkg = await fs.readJson('./package.json')

  const cmds = new Map<string, T>()
  function rec(cli: T) {
    const commands = Object.values(cli.commands) as T[]
    if (commands.length === 0) {
      cmds.set(
        getCommandAndAncestors(cli)
          .reverse()
          .slice(1)
          .map((c) => {
            return c.name
          })
          .join(' '),
        cli
      )
    } else {
      commands.forEach((c: T) => {
        return rec(c)
      })
    }
  }
  rec(cli)
  const keys = Array.from(cmds.keys()).sort()

  const padLen =
    Math.max(
      ...keys.map((k) => {
        return k.length
      })
    ) + 2

  console.log('Command: ', colors.magenta(cli.name))

  const p = prompt
    .search(cli.name) //
    .choices(keys)
    .filtering({ includes: true, startsWith: true, caseSensitive: true })
    .clearFirst(true)
    .limit(50)
    .searchStopSequence(':')
    .name('yarn')
    .preRender((parsed) => {
      return parsed.map((part) => {
        const cmd = pkg.scripts?.[part]
        if (!cmd) {
          return part
        }
        return part.padEnd(padLen, ' ') + cmd
      })
    })
  const res = await p.run()
  // const metadata = res.metadata
  const selected = res.selected
  const argv = selected
    .split(' ')
    .map((a) => {
      return a.trim()
    })
    .filter(Boolean)
  const selectedCmd = cmds.get(selected)!

  /////////// OPTIONS AND ARGUMENTS ///////////

  const userOptions = selectedCmd.options.filter((opt) => {
    return !opt.hidden
  })

  const availableOptions = [...userOptions]
  let argIndex = 0

  while (true) {
    const hasArgs = argIndex < selectedCmd.arguments.length
    const hasOpts = availableOptions.length > 0

    // Only exit when there are no more args AND no more options
    if (!hasArgs && !hasOpts) {
      break
    }

    // If no args remain but options do, still allow option selection
    // If args remain, keep going regardless of options

    const cmdSearch = new CommandSearchPrompt(argv.join(' '))
      .commandArguments(selectedCmd.arguments)
      .commandOptions(availableOptions)
      .argIndex(argIndex)
      .filledArgv(argv)
      .clearFirst(true)
      .limit(50)

    const searchRes = await cmdSearch.run()
    const value = searchRes.selected

    if (!value || value === DONE_VALUE) {
      break
    }

    // Check if selection is an option
    const matchedOption = availableOptions.find((opt) => {
      return `--${opt.long}` === value
    })

    if (matchedOption) {
      const idx = availableOptions.indexOf(matchedOption)
      availableOptions.splice(idx, 1)

      if (matchedOption.type === 'boolean') {
        argv.push(`--${matchedOption.long}`)
      } else {
        await promptOptionValue(matchedOption, argv)
      }
    } else {
      // It's an argument value
      argv.push(value)
      if (!selectedCmd.arguments[argIndex]?.variadic) {
        argIndex++
      }
    }
  }

  ///////////////////////////////////////////

  console.log()
  console.log(cli.name, argv)
  const confirmed = await prompt.confirm(`Run ${cli.name} with these arguments?`).initial(true).run()
  console.log()

  if (confirmed) {
    process.argv.push(...argv)
  }
}
