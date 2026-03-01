import fs from 'fs-extra'
import { prompt } from '@mono/prompt'

const pkg = await fs.readJson('./package.json')

const keys = Object.keys(pkg.scripts || {})

const p = prompt
  .search('yarn run') //
  .choices(keys)
  .filtering({ includes: true, startsWith: true, caseSensitive: true })
  .clearFirst(true)
  .searchStopSequence(' -- ')
  .name('yarn')

if (process.argv.includes('--full')) {
  const padLen =
    Math.max(
      ...keys.map((k) => {
        return k.length
      })
    ) + 2

  p.preRender((parsed) => {
    return parsed.map((part) => {
      const cmd = pkg.scripts?.[part]
      if (!cmd) {
        return part
      }

      return part.padEnd(padLen, ' ') + cmd
    })
  })
}
const res = await p.run({
  onCancel: async (self, answer) => {
    // console.dir(self, { depth: null })
    console.log('cancel', { answer })
  },
  onSubmit: async (self, answer) => {
    // console.dir(self, { depth: null })
    console.log('submit', { answer })
  },
})
console.dir(res, { depth: null })
const metadata = res.metadata
const args = metadata.inputAfterStop.replace(/^\s?--\s+/, '')
const selected = res.selected
const cmd = `yarn ${selected} ${args}`
console.log('>', cmd)
// cp.execSync(cmd, { stdio: 'inherit' })
