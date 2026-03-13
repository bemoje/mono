import upath from 'upath'

const eslintRules = [
  `--rule 'unused-imports/no-unused-imports: error'`,
  `--rule 'arrow-body-style: error'`,
  //
]

export default {
  '*': [
    'prettier --ignore-unknown --write --list-different', //
  ],

  '*.{js,mjs}': [
    `eslint --fix ${eslintRules.join(' ')}`, //
    `prettier --write --list-different`,
  ],

  '*.ts': (files) => {
    const srcFiles = files
      .map((file) => {
        return upath.relative(process.cwd(), file)
      })
      .filter((file) => {
        return file.startsWith('libs/') || file.startsWith('apps/')
      })
      .filter((file) => {
        return file.includes('/src/')
      })
      .filter((file) => {
        return file.endsWith('.ts')
      })

    const wsDirpaths = srcFiles
      .map((file) => {
        return file.split('/').slice(0, 2).join('/')
      })
      .filter(Boolean)
      .join(' ')

    const libDirnames = srcFiles
      .filter((file) => {
        return file.startsWith('libs/')
      })
      .filter((file) => {
        return !file.endsWith('.test.ts')
      })
      .map((file) => {
        return file.split('/')[1]
      })
      .filter(Boolean)
      .join(' ')

    return [
      libDirnames ? `yarn dk fix-index-ts --add-to-staged ${libDirnames}` : '',
      wsDirpaths ? `yarn dk fix-missing-dependencies --yes --add-to-staged ${wsDirpaths}` : '',

      `eslint --fix ${eslintRules.join(' ')} ${files.join(' ')}`,
      `prettier --write --list-different ${files.join(' ')}`,
    ].filter(Boolean)
  },
}
