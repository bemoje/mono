import cp from 'child_process'
import fs from 'fs-extra'

const filepaths = cp.execSync(`glob '**/*' -i '**/{.dist,.coverage,.yarn,node_modules}/**/*'`, { encoding: 'utf-8' }).split('\n').filter(Boolean)

const regex = new RegExp(String.fromCharCode(8212), 'g')

const promises = filepaths.map(async (filepath) => {
  const src = await fs.readFile(filepath, 'utf-8')
  const res = src.replace(regex, '-')
  if (src !== res) {
    await fs.writeFile(filepath, res, 'utf-8')
    console.log(`Replaced bad dash char in ${filepath}`)
  }
})

await Promise.all(promises)
