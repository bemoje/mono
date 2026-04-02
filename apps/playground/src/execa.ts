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
        await xegg({})(`yarn fix`)
      },
    },
    'lint:fix': {
      dependencies: ['install', 'fix'],
      run: async () => {
        await xegg({})(`yarn lint:fix`)
      },
    },
    'format:write:all': {
      dependencies: ['install', 'fix', 'lint:fix'],
      run: async () => {
        await xegg({})(`yarn format:write:all`)
      },
    },
    'typecheck': {
      dependencies: ['install', 'fix', 'lint:fix', 'format:write:all'],
      run: async () => {
        await xegg({})(`yarn typecheck`)
      },
    },
    'check': {
      dependencies: ['install', 'fix', 'lint:fix', 'format:write:all'],
      run: async () => {
        await xegg({})(`yarn check`)
      },
    },
    'build': {
      dependencies: ['install', 'fix', 'lint:fix', 'format:write:all', 'typecheck'],
      run: async () => {
        await xegg({})(`yarn build`)
      },
    },
    'test-coverage': {
      dependencies: ['install', 'fix', 'lint:fix', 'format:write:all'],
      run: async () => {
        await xegg({})(`yarn test-coverage`)
      },
    },
    'test-coverage-full': {
      dependencies: ['install', 'test-coverage'],
      run: async () => {
        await xegg({})(`yarn test-coverage-full`)
      },
    },
    'readme': {
      dependencies: ['install', 'format:write:all', 'test-coverage'],
      run: async () => {
        await xegg({})(`yarn readme`)
      },
    },
  },
})

const xegg = function xegg(...args: any[]) {
  if (typeof args[0] === 'string') {
    args.unshift({})
  }
  if (typeof args[0] === 'object') {
    const opts = args[0]
    opts.stdio ??= 'inherit'
    opts.env ??= {}
    opts.env.FORCE_COLOR ??= 'true'
  }
  // @ts-ignore
  return $(...args)
} as typeof $

await queue.run()

// const transform = function* (line: any) {
//   yield line
// }

// await xegg({
//   stdout: [transform, 'inherit'],
//   // shell: 'C:/Program Files/Git/bin/bash.exe',
//   shell: true,
//   preferLocal: true,
//   // reject: false,
//   // detatch: true,
// })`
// Get-Command bash
// `
