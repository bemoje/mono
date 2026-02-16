import cp from 'child_process'
import fs from 'fs'
import upath from 'upath'

const devkitPath = upath.joinSafe('.dist', 'devkit.cjs')
if (!fs.existsSync(devkitPath)) {
  cp.execSync('yarn workspace @bemoje/devkit build', { stdio: 'inherit' })
}
