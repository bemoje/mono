import cp from 'node:child_process'

cp.execSync(
  `yarn workspaces foreach --all --topological --jobs 15 --exclude mono --verbose --include ${process.argv[2]} ${process.argv.slice(3).join(' ')}`,
  { stdio: 'inherit', shell: true }
)
