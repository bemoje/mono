export function createHints(names: string[], scripts: Record<string, string>) {
  const padLen = Math.max(
    ...names.map((k) => {
      return k.length
    })
  )

  return new Map(
    names.map((name) => {
      const termWidth = process.stdout.columns
      const available = termWidth - padLen - 5
      const body = (scripts?.[name] ?? '') as string
      const padded = name.padEnd(padLen, ' ')
      let hint = padded.slice(name.length)
      if (body.length > available) {
        const arr = [] as string[]
        let current = ''
        body.split(' ').forEach((arg, i, elems) => {
          const newLength = current.length + 1 + arg.length
          const withArg = current ? `${current} ${arg}` : arg
          if (newLength > available) {
            arr.push(current)
            current = arg
          } else {
            current = withArg
          }
          if (current && i === elems.length - 1) {
            arr.push(current)
          }
        })
        hint += arr
          .map((line, i) => {
            return i === 0 ? line : `${''.padEnd(padLen + 3, ' ')}${line}`
          })
          .join('\n')
      } else {
        hint += body
      }

      return [name, hint] as const
    })
  )
}
