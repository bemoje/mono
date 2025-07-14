import fs, { Stats } from 'fs-extra'
import path from 'upath'
import walkdir from 'walkdir'
import { WalkOptions } from 'walkdir'

/**
 * Walk a directory recursively and return an array of paths.
 */
export function walkDirectory(dirpath: string, options: WalkDirectoryOptionsWithoutStats): string[]

/**
 * Walk a directory recursively and return an array of [path: string, stats: Stats] tuples.
 */
export function walkDirectory(
  dirpath: string,
  options: WalkDirectoryOptionsWithStats,
): [path: string, stats: Stats][]

/**
 * Walk a directory recursively.
 */
export function walkDirectory(dirpath: string, options: WalkDirectoryOptions) {
  dirpath = path.normalizeSafe(dirpath)
  if (!options.stats && !options.only) {
    return walkdir
      .sync(dirpath, {
        ...convertToWalkdirOptions(options), //
        return_object: false,
      })
      .map((fspath) => path.normalizeSafe(fspath))
  }

  let entries = Object.entries(walkdir.sync(dirpath, convertToWalkdirOptions(options)))

  if (options.only === 'files') {
    entries = entries.filter(([_, stats]) => stats.isFile())
  } else if (options.only === 'directories') {
    entries = entries.filter(([_, stats]) => stats.isDirectory())
  }

  entries = entries.map(([fspath, stats]) => [path.normalizeSafe(fspath), stats])

  if (options.stats) {
    return entries
  } else {
    return entries.map(([fspath]) => fspath)
  }
}

/**
 * Options for @see walkDirectory
 */
export interface WalkDirectoryOptions {
  /**
   * Return stats for each path.
   */
  stats?: boolean

  /**
   * Only return either files or directories.
   */
  only?: 'files' | 'directories'

  /**
   * Recursion depth limit.
   */
  maxDepth?: number

  /**
   * Determine whether to walk a given directory.
   */
  filter?: (dirpath: string, basename: string) => boolean

  /**
   * Follow symbolic links.
   */
  followSymlinks?: boolean

  /**
   * On filesystems where inodes are not unique (eg. windows), some files may not be walked due to inode collision.
   * Turning off this behavior may be required but at the same time may lead to hitting max_depth via link loop.
   */
  ignoreInodes?: boolean
}

function convertToWalkdirOptions(options: WalkDirectoryOptions): WalkOptions {
  const result: WalkOptions = {
    fs: fs,
    sync: true,
    return_object: true,
  }
  if (options.maxDepth !== undefined) result.max_depth = options.maxDepth
  if (options.followSymlinks !== undefined) result.follow_symlinks = options.followSymlinks
  if (options.ignoreInodes !== undefined) result.track_inodes = !options.ignoreInodes
  if (options.filter) {
    const filter = options.filter!
    result.filter = (dirpath: string, files: string[]) => {
      return filter(path.normalizeSafe(dirpath), path.basename(dirpath)) ? files : []
    }
  }
  return result
}

interface WalkDirectoryOptionsWithoutStats extends WalkDirectoryOptions {
  stats?: false
}

interface WalkDirectoryOptionsWithStats extends WalkDirectoryOptions {
  stats: true
}
