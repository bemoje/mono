import cp from 'node:child_process'
import fs from 'fs-extra'

const ws = fs.existsSync(`libs/${process.argv[2] ?? ''}`) ? `@mono/${process.argv[2]}` : process.argv[2]

cp.execSync(`yarn workspace ${ws} ${process.argv.slice(3).join(' ')}`, { stdio: 'inherit', shell: true })
