$files = git diff --cached --name-only
$files += git diff --name-only
$files += git ls-files --others --exclude-standard

$files = $files |
  Sort-Object |
  Get-Unique |
  Where-Object { $_ -and (Test-Path $_) -and -not (Get-Item $_).PSIsContainer }

if ($files) {
  yarn prettier --check --ignore-unknown @files
} else {
  Write-Host 'No modified files to check.'
}
