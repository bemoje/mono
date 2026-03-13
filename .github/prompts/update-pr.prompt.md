---
name: update-pr
description: Update the PR description with the changes from the open PR and set fitting labels.
---

Use tool #openPullRequest to:

1. Check whether there currently is an open PR for the branch. If not, create a new PR set up to merge into the `main` branch.
2. Set me as assignee.
3. Read the open PR changes and write pr description and write to temp file and then use `gh` command to insert it into pr description.
4. Also set fitting label(s) on the PR.
