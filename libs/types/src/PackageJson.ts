export interface PackageJson {
  name?: string
  packageManager?: string
  resolutions?: { [key: string]: string }
  workspaces?: string[]
  version?: string
  private?: boolean
  description?: string
  type?: string
  main?: string
  module?: string
  typings?: string
  types?: string
  scripts?: {
    [key: string]: string
  }
  repository?: {
    type: string
    url: string
  }
  keywords?: string[]
  author?: string
  license?: string
  bugs?: {
    url: string
  }
  homepage?: string
  dependencies?: {
    [key: string]: string
  }
  devDependencies?: {
    [key: string]: string
  }
  peerDependencies?: {
    [key: string]: string
  }
  browserslist?:
    | string[]
    | {
        [key: string]: string
      }
  engines?: {
    node: string
    npm?: string
    yarn?: string
  }
  funding?: {
    type: string
    url: string
  }
  preferGlobal?: boolean
  bin?:
    | string
    | {
        [key: string]: string
      }
}
