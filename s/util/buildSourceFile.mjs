import path from 'upath'
import { buildStats } from './buildStats.mjs'
import { buildFile } from './buildFile.mjs'

export async function buildSourceFile(filepath, distdir = '.dist') {
  const parsed = parseInfile(filepath, distdir)
  await buildFile(parsed.filepath, parsed.outfile, parsed.tsconfig)
  const stats = await buildStats(parsed.outfile)
  console.log({ [parsed.filename]: { ...parsed, ...stats } })
}

function toRelativePath(fspath) {
  return path.relative(process.cwd(), path.normalizeSafe(fspath))
}

function parseInfile(filepath, distdir = '.dist/temp') {
  filepath = toRelativePath(filepath)
  const basename = path.basename(filepath)
  const _split = filepath.split('/')
  const srcDirIndex = _split.indexOf('src')
  const isSourceFile = srcDirIndex !== -1
  const workspace = isSourceFile ? path.join(..._split.slice(0, 2)) : undefined
  const tsconfig = path.joinSafe(workspace, 'tsconfig.json')
  const subpath = isSourceFile ? _split.slice(srcDirIndex + 1, -1).join('/') : path.dirname(filepath)
  const outdir = path.joinSafe(distdir, workspace, subpath)
  const outfile = path.joinSafe(outdir, path.changeExt(basename, '.cjs'))
  return { basename, workspace, filepath, tsconfig, subpath, distdir, outdir, outfile }
}
