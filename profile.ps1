function Publish-Lib {
  [CmdletBinding()]
  param(
    [Parameter(Mandatory=$true)][string]$Lib,
    [Parameter(Mandatory=$true)][string]$Up
  )

  yarn workspace @mono/$Lib version $Up
  if ($LASTEXITCODE) { throw "version failed" }

  yarn workspace @mono/$Lib run build
  if ($LASTEXITCODE) { throw "build failed" }

  yarn workspace @mono/$Lib exec "cd dist && npm publish"
}

Set-Alias publishLib Publish-Lib
