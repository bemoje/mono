import type { Command } from '@mono/cli'
import type { Option } from '@mono/cli'
import colors from 'ansi-colors'
import fs from 'fs-extra'
import { getCommandAndAncestors } from '@mono/cli'
import { last } from 'es-toolkit'
import { prompt } from '@mono/prompt'
import stringArgv from 'string-argv'

// eslint-disable-next-line max-lines-per-function, @typescript-eslint/no-explicit-any
export async function runInteractive<T extends Command<any, any, any>>(cli: T) {
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

  /////////// OPTIONS ///////////

  // Interactive options guide
  const userOptions = selectedCmd.options.filter((opt) => {
    return !opt.hidden
  })

  // console.log({ userOptions })

  if (userOptions.length) {
    console.log()
    console.log(colors.blue('Options:'), colors.gray('Select options to enable'))

    const selectedOptions: Option[] = []

    await prompt
      .autocompleteMultiselect(argv.join(' '))
      .name('options')
      .instructions('')
      .optionsPerPage(50)
      .choices(
        userOptions.map((opt) => {
          return { title: opt.flags, value: opt.long, description: opt.description ?? '' }
        })
      )
      .run({
        onSubmit: (_, selected?: string[]) => {
          if (!selected) {
            return
          }

          selected.forEach?.((long) => {
            const opt = userOptions.find((o) => {
              return o.long === long
            })
            if (!opt) {
              throw new Error(`Selected option ${long} not found in user options`)
            }
            selectedOptions.push(opt)
          })
        },
      })

    for (const opt of selectedOptions) {
      if (opt.type === 'boolean') {
        argv.push(`--${opt.long}`)
      } else {
        await promptOptionValue(opt, argv)
      }
    }

    if (last(selectedOptions)?.variadic) {
      argv.push('--')
    }

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
                argv.push(`--${opt.name}`, ...values)
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
                    argv.push(`--${opt.name}`, v)
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
                argv.push(`--${opt.name}`, value)
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
                argv.push(`--${opt.name}`, value)
              }
            },
          })
      }
    }
  }

  /////////// ARGUMENTS ///////////

  for (let i = 0; i < selectedCmd.arguments.length; i++) {
    const arg = selectedCmd.arguments[i]

    console.log()
    console.log(
      `Argument [${i}]:`,
      arg.required ? colors.red(arg.usage) : colors.cyan(arg.usage),
      colors.gray(arg.description ?? '')
    )

    if (arg.variadic) {
      if (arg.choices?.length) {
        await prompt
          .autocompleteMultiselect(argv.join(' '))
          .name(arg.name)
          .instructions('')
          .optionsPerPage(50)
          .choices(arg.choices!)
          .run({
            onSubmit: (_, selections?: string | string[]) => {
              selections = [selections ?? []].flat(2)
              if (!selections.join(' ').includes('>>')) {
                argv.push(
                  ...selections
                    .map((s) => {
                      return s.trim()
                    })
                    .filter(Boolean)
                )
              } else if (arg.required) {
                throw new Error('Argument is required')
              }
              // console.log({ selections, cmd })
            },
            onCancel: (_, selections) => {
              selections = [selections ?? []].flat(2)
              if (!selections.join('').trim()) {
                i-- // prompts same arg again, ie. just wipes user input
              }
            },
          })
      }
    } else {
      if (arg.choices?.length) {
        await prompt
          .search(argv.join(' '))
          .name(arg.name)
          .clearFirst(true)
          .choices(arg.choices!)
          .limit(50)
          .run({
            onSubmit: (_, answer) => {
              answer = answer?.trim() ?? ''
              if (answer && !answer.includes('>>')) {
                argv.push(answer)
              } else if (arg.required) {
                throw new Error('Argument is required')
              }
              // console.log({ answer, cmd })
            },
          })
      } else {
        await prompt
          .text(argv.join(' '))
          .name(arg.name)
          .run({
            onSubmit: (_, answer) => {
              answer = answer?.trim() ?? ''
              if (answer && !answer.includes('>>')) {
                argv.push(answer)
                // console.log({ answer, cmd })
              } else if (arg.required) {
                throw new Error('Argument is required')
              }
            },
          })
      }
    }
  }

  console.log()
  console.log('argv:', { [cli.name]: argv })
  const confirmed = await prompt.confirm(`Run ${cli.name} with these arguments?`).run()
  console.log()

  if (confirmed) {
    process.argv.push(...argv)
  }
}
