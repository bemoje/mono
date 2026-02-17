# Get number of current branch's open PR

```ps1
$branch = git branch --show-current;
$prNumber = gh pr list --head $branch --limit 1 --json number | ConvertFrom-Json | Select-Object -ExpandProperty number;
if ($prNumber) { $prNumber } else { "" }
```

# Get the base branch of the current PR

```ps1
$branch = git branch --show-current;
$prNumber = gh pr list --head $branch --limit 1 --json number | ConvertFrom-Json | Select-Object -ExpandProperty number;
$baseRef = gh pr view $prNumber --json baseRefName | ConvertFrom-Json | Select-Object -ExpandProperty baseRefName
$baseRef
```

# Git diff base branch

```ps1
$branch = git branch --show-current;
$prNumber = gh pr list --head $branch --limit 1 --json number | ConvertFrom-Json | Select-Object -ExpandProperty number;
$baseRef = gh pr view $prNumber --json baseRefName | ConvertFrom-Json | Select-Object -ExpandProperty baseRefName
git diff $baseRef
```

# Format all files changed in current PR

```ps1
$branch = git branch --show-current;
$prNumber = gh pr list --head $branch --limit 1 --json number | ConvertFrom-Json | Select-Object -ExpandProperty number;
$files = gh pr view $prNumber --json files | ConvertFrom-Json;
$filePaths = $files.files | ForEach-Object { $_.path };
if ($filePaths) { yarn prettier --ignore-unknown --check @filePaths }
```

# Get URL of current branch's open PR

```ps1
$branch = git branch --show-current;
$prNumber = gh pr list --head $branch --limit 1 --json number | ConvertFrom-Json | Select-Object -ExpandProperty number;
$prUrl = gh pr view $prNumber --json url | ConvertFrom-Json | Select-Object -ExpandProperty url
$prUrl

```

# Set PR body to own formatted git log

```ps1
$log = git log --pretty=format:"%h %s" # Adjust formatting as needed
gh pr edit --body "$log"

```

# Mark current PR as ready for review and update PR body

```ps1
$branch = git branch --show-current;
$prNumber = gh pr list --head $branch --limit 1 --json number | ConvertFrom-Json | Select-Object -ExpandProperty number;
gh pr ready $prNumber
$log = git log --pretty=format:"%h %s"
gh pr edit --body "$log"

```

# List all files changed in current PR

```ps1
$branch = git branch --show-current;
$prNumber = gh pr list --head $branch --limit 1 --json number | ConvertFrom-Json | Select-Object -ExpandProperty number;
$files = gh pr view $prNumber --json files | ConvertFrom-Json;
$files.files | ForEach-Object { $_.path }

```
