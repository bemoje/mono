import * as esbuild from 'esbuild'

export async function buildFile(filepath, outfile, tsconfig, optionsOverride = {}) {
  return await esbuild.build({
    entryPoints: [filepath],
    bundle: true,
    outfile: outfile,
    tsconfig: tsconfig,
    platform: 'node',
    format: 'cjs',
    target: ['node20'],
    external: [],
    minify: false,
    minifyWhitespace: false,
    minifySyntax: false,
    minifyIdentifiers: false,
    keepNames: true,
    mainFields: ['module', 'main'],
    sourcemap: true,
    treeShaking: true,
    ...optionsOverride,
  })
}
