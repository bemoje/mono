import { parseArgs } from 'util'

const { values, positionals } = parseArgs({
  options: {
    name: { type: 'string' },
    age: { type: 'string' },
    verbose: { type: 'boolean', short: 'v' },
  },
  tokens: true,
})
console.log(values, positionals)
