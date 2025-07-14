import colors from 'ansi-colors'
import { exec } from 'child_process'
import { glob } from 'glob'
import upath from 'upath'
import fs from 'fs-extra'
import { getRepoRootDirpath } from './repoutil.mjs'

const repoPath = getRepoRootDirpath()
const repoPkgPath = upath.join(repoPath, 'package.json')
const pkg = await fs.readJson(repoPkgPath, { throws: false })

const wspaths = await glob('{apps,libs,packages}/*/', { cwd: repoPath })

const promises = wspaths.map((wsPath) => {
  wsPath = upath.normalize(wsPath)
  return new Promise((resolve) => {
    const cmd = `yarn depcheck ${wsPath} --skip-missing --oneline --ignores "@${pkg.name}/*"`
    const res = exec(cmd, { encoding: 'utf8' })
    res.stdout.on('data', (data) => {
      if (data.includes('No depcheck issue')) {
        resolve()
      }
      data.split('\n').forEach((line, i, arr) => {
        if (/(Unused|Missing) (devDependencies|dependencies)/g.test(line)) {
          console.info(colors.cyan(wsPath) + ' : ' + colors.yellow(line) + ' :: ' + arr[i + 1])
        }
      })
    })
    res.stdout.on('end', resolve)
    res.on('close', resolve)
    res.on('error', console.error)
    res.stderr.on('error', console.error)
    res.stdout.on('error', console.error)
  })
})

await Promise.all(promises)
