import { $ } from 'execa'
import { AsyncDependencyQueue } from '@mono/queue'

// const child = $({
//   shell: 'C:/Program Files/Git/bin/bash.exe',
//   env: { FORCE_COLOR: 'true' },
//   preferLocal: true,
//   all: true,
//   reject: false,
//   detatch: true,
// })`
// # yarn install
// # yarn wsp '**' exec echo hi
// # yarn dk asf asaa
// eslint -h
// `
// for await (const line of child.iterable()) {
//   const stripped = ansiColors.stripColor(line)
//   if (!stripped.includes('fix')) {
//     console.log(line)
//   }
// }
// console.log('Done', child.exitCode)

const queue = new AsyncDependencyQueue({
  concurrency: 3,
  taskDefinitions: {
    'install': { dependencies: [], run: async () => {} },
    'fix': {
      dependencies: ['install'],
      run: async () => {
        await exe({})(`yarn fix`)
      },
    },
    'lint:fix': {
      dependencies: ['install', 'fix'],
      run: async () => {
        await exe({})(`yarn lint:fix`)
      },
    },
    'format:write:all': {
      dependencies: ['install', 'fix', 'lint:fix'],
      run: async () => {
        await exe({})(`yarn format:write:all`)
      },
    },
    'typecheck': {
      dependencies: ['install', 'fix', 'lint:fix', 'format:write:all'],
      run: async () => {
        await exe({})(`yarn typecheck`)
      },
    },
    'check': {
      dependencies: ['install', 'fix', 'lint:fix', 'format:write:all'],
      run: async () => {
        await exe({})(`yarn check`)
      },
    },
    'build': {
      dependencies: ['install', 'fix', 'lint:fix', 'format:write:all', 'typecheck'],
      run: async () => {
        await exe({})(`yarn build`)
      },
    },
    'test-coverage': {
      dependencies: ['install', 'fix', 'lint:fix', 'format:write:all'],
      run: async () => {
        await exe({})(`yarn test-coverage`)
      },
    },
    'test-coverage-full': {
      dependencies: ['install', 'test-coverage'],
      run: async () => {
        await exe({})(`yarn test-coverage-full`)
      },
    },
    'readme': {
      dependencies: ['install', 'format:write:all', 'test-coverage'],
      run: async () => {
        await exe({})(`yarn readme`)
      },
    },
  },
})

const exe = function exe(...args: any[]) {
  if (typeof args[0] === 'string') {
    args.unshift({})
  }
  if (typeof args[0] === 'object') {
    const opts = args[0]
    opts.stdio ??= 'inherit'
    opts.env ??= {}
    opts.env.FORCE_COLOR ??= 'true'
    if (process.platform === 'win32') {
      if (opts.shell === true) {
        opts.shell = 'powershell'
      } else if (
        (opts.shell && opts.shell.endsWith('bash.exe') && opts.shell.includes('system32')) ||
        /^bash(\.exe)?$/.test(String(opts.shell))
      ) {
        opts.shell = 'C:/Program Files/Git/bin/bash.exe'
      }
    }
  }
  // @ts-ignore
  return $(...args)
} as typeof $

await queue.run()

// const transform = function* (line: any) {
//   yield line
// }

// await exe({
//   stdout: [transform, 'inherit'],
//   // shell: 'C:/Program Files/Git/bin/bash.exe',
//   shell: true,
//   preferLocal: true,
//   // reject: false,
//   // detatch: true,
// })`
// Get-Command bash
// `
