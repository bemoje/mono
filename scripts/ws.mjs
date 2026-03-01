import cp from 'child_process'

cp.execSync(`yarn workspace @mono/${process.argv[2]} ${process.argv.slice(3).join(' ')}`, {
  stdio: 'inherit',
  shell: true,
})
