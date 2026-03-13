import { $ } from 'execa'
import ansiColors from 'ansi-colors'
import fs from 'fs-extra'

await fs.outputFile('./OUTPUT.log', '')

const child = $({
  // shell: 'C:/Program Files/Git/bin/bash.exe',
  shell: 'powershell',
  env: { FORCE_COLOR: 'true' },
  preferLocal: true,
  // all: true,
  // reject: false,

  detatch: true,
})`
yarn install;
echo '----------------------------------------------------';
yarn turbo run runall --output-logs=new-only --log-order grouped;
echo '----------------------------------------------------';
yarn turbo run runall --output-logs=new-only --log-order grouped;
echo '----------------------------------------------------';
yarn turbo run runall --output-logs=new-only --log-order grouped;
echo '----------------------------------------------------';
yarn turbo run runall --output-logs=new-only --log-order grouped;
echo '----------------------------------------------------';
yarn turbo run runall --output-logs=new-only --log-order grouped;
echo '----------------------------------------------------';
yarn turbo run runall --output-logs=new-only --log-order grouped;
echo '----------------------------------------------------';
yarn turbo run runall --output-logs=new-only --log-order grouped;
echo '----------------------------------------------------';
`

for await (const line of child.iterable()) {
  console.log(line)
  await fs.appendFile('./OUTPUT.log', `${ansiColors.stripColor(line)}\n`, { encoding: 'utf-8' })
}
console.log('Done', child.exitCode)
