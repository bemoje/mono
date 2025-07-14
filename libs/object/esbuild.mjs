import * as esbuild from 'esbuild'
import upath from 'upath'

await esbuild.build({
  entryPoints: ['./src/index.ts'],
  bundle: true,
  outfile: `../../.dist/${upath.basename(process.cwd())}.cjs`,
  tsconfig: 'tsconfig.json',
  platform: 'node',
  format: 'cjs',
  target: ['node21'],
  treeShaking: true,
  mainFields: ['module', 'main'],
  sourcemap: true,

  minify: false,
  minifyWhitespace: false,
  minifySyntax: false,
  minifyIdentifiers: false,
  keepNames: true,
})
