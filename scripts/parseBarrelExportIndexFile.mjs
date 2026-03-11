import fs from 'fs-extra'

export function parseBarrelExportIndexFile() {
  return (fs.existsSync('src/index.ts') ? fs.readFileSync('src/index.ts', 'utf8').split('\n') : [])
    .filter((line) => {
      return line.startsWith('export * from ')
    })
    .map((line) => {
      return line
        .split('export * from ')[1]
        .slice(1)
        .replaceAll(/["';]+$/g, '')
    })
    .concat('./index')
    .map((file) => {
      return `${file.replace(/^\./, 'src')}.ts`
    })
}
