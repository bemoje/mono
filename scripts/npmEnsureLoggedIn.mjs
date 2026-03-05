import cp from 'node:child_process'

try {
  const whoami = cp.execSync(`npm whoami`, { shell: true, stdio: 'pipe', encoding: 'utf-8' }).trim()
  if (whoami.split('\n').length === 1) {
    console.log('whoami:', whoami)
  } else {
    throw new Error('Not logged in')
  }
} catch (_) {
  cp.execSync(`npm login`, { shell: true, stdio: 'inherit' })
}
