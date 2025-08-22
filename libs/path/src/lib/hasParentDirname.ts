/**
 * Whether fspath is a subpath of a parent directory with the given name.
 */
export function hasParentDirname(fspath: string, name: string) {
  return new RegExp('(^|[/\\\\])' + name + '[/\\\\]').test(fspath)
}
