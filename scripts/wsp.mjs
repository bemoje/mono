import cp from 'child_process'

cp.execSync(
  `yarn workspaces foreach --parallel --all --topological --jobs 10 --exclude mono --verbose --include ${process.argv[2]} ${process.argv.slice(3).join(' ')}`,
  { stdio: 'inherit', shell: true }
)
