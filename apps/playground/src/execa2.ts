import { $ } from 'execa'
import ansiColors from 'ansi-colors'

process.env.FORCE_COLOR = 'true'

const transform = function* (line: string) {
  yield line.toUpperCase()
}

const xec = $({
  env: { FORCE_COLOR: 'true' },
  preferLocal: true,
  stdin: 'inherit',
  stdout: 'pipe',
  lines: true,
  // verbose: 'none',
  // verbose: 'short',
  // verbose: 'full',

  // reject: false,
  // detatch: true,
})

//  xec({
//     stdout: (line:string) => {
//       return line.toUpperCase()
//     }
// }),`glob libs/*/*.md`

const child = await xec`glob libs/*/*.md`

for await (const line of child.stdout) {
  if (line.includes('template')) {
    console.log(ansiColors.red(line))
  } else {
    console.log(line)
  }
}
console.log('Done', child.exitCode)

// const shell = 'C:/Program Files/Git/bin/bash.exe'
// const { stdout, pipedFrom } = await execa(`ls -al`, { shell }).pipe(`sort`, { shell }).pipe(`head -n 2`, { shell })

// // Output of `npm run build | sort | head -n 2`
// console.log(stdout)
// console.log('----------------')
// // Output of `npm run build | sort`
// console.log(pipedFrom[0].stdout)
// console.log('----------------')
// // Output of `npm run build`
// console.log(pipedFrom[0].pipedFrom[0].stdout)

// ---

// import { $ } from 'execa'

// function* transform(line: string): IterableIterator<string> {
//   yield line.toUpperCase()
// }

// const xec = $({ lines: true, env: { FORCE_COLOR: 'true' } })

// const child = xec(`glob libs/*/*.md`, {})

// void child

// child.stdout?.pipe(transform).pipe(process.stdout)
