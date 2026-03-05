# linkedin-resume

A CLI tool that scrapes your LinkedIn profile and generates a professionally styled resume as PDF, HTML, and
Markdown.

## Features

- **Automated LinkedIn scraping** - Extracts your profile, work experience, education, projects, skills,
  recommendations, and languages using Puppeteer.
- **HTML resume generation** - Renders a clean, LinkedIn-style HTML resume with grouped work experience, skill
  pills, and recommendation links.
- **Markdown resume generation** - Generates a readable, well-structured Markdown resume (`resume.md`) for easy
  editing or sharing.
- **PDF output** - Converts the HTML resume to PDF via headless Chrome (Windows).
- **Configurable** - Control output path, extra profiles (e.g. GitHub), and selectively ignore resume sections or
  specific entries.
- **Persistent login** - Uses a dedicated Chrome profile so you only need to log in to LinkedIn once.

## Installation

```sh
npm install -g linkedin-resume
```

## Quick start

```sh
# First run - prompts for your LinkedIn username and creates a config file
linkedin-resume

# Open the config file in VS Code to customize settings
linkedin-resume config


# Re-render without scraping again (useful for config tweaks)
linkedin-resume --render

# The following files are generated in your app data directory:
# - `resume.json` (full resume data, useful for debugging or custom rendering)
# - `resume.html` (styled HTML)
# - `resume.pdf` (PDF, if Chrome is available)
# - `resume.md` (Markdown, for easy editing/sharing)
```

## Usage

```
Usage: linkedin-resume [options] [command] [outputFilepath]

A CLI tool to generate a LinkedIn resume in PDF, HTML, and Markdown formats.

Arguments:
  outputFilepath    Optional filepath. Defaults to value set in config file.

Options:
  -V, --version     output the version number
  --debug           enable debug output
  --render          skip scraping, only render
  --no-headless     show scraping browser window
  --keep-open       keep browser open after scraping
  -h, --help        display help for command

Commands:
  config [options]  Create or update config file with LinkedIn username and other settings
```

### Examples

```sh
# Scrape and generate in headless mode (default)
linkedin-resume

# Show the browser window during scraping
linkedin-resume --no-headless


# Skip scraping, re-render from previously scraped data (updates HTML, PDF, and Markdown, JSON)
linkedin-resume --render

# Output PDF to a custom path
linkedin-resume ~/Documents/my-resume.pdf

# Print the config file path
linkedin-resume config --path

# Open the config file in VS Code for editing
linkedin-resume config
```

## How it works

1. **Login check** - Ensures you are logged in to LinkedIn via a persistent Chrome profile.
2. **Scrape** - Opens multiple LinkedIn pages in parallel (profile, experience, education, projects, skills,
   recommendations) and saves the scraped data as JSON files.
3. **Render JSON** - Merges all scraped data into a single `resume.json` conforming to the
   [Resume schema](./resume.schema.json).
4. **Render HTML** - Generates a styled `resume.html` from the resume data, applying any ignore filters from your
   config.
5. **Render Markdown** - Generates a readable `resume.md` for easy editing, sharing, or conversion to other
   formats.
6. **Render PDF** - Converts the HTML to PDF using headless Chrome and copies it to your configured output path.

## Configuration

The config file is created automatically on first run and stored in your system's app data directory. Open it with:

```sh
linkedin-resume config
```

### Config file structure

```jsonc
{
  // Your LinkedIn username (from your profile URL)
  "linkedInUsername": "johndoe",

  // Where to save the generated PDF. Supports environment variables.
  "outputFilepath": "$USERPROFILE/Desktop/resume.pdf",

  // Additional profiles to display in the resume header
  "social": [{ "network": "GitHub", "username": "johndoe", "url": "https://github.com/johndoe" }],

  // Selectively ignore sections or specific entries when rendering
  "ignore": {
    // Set to true to hide the entire section, or an array to hide specific entries
    "work": [{ "name": "Company Inc.", "position": "Intern" }],
    "education": true,
    "projects": [{ "name": "Old Project" }],
    "skills": [{ "name": "Microsoft Word" }],
    "languages": true,
    "recommendations": true,
  },
}
```

### Ignore filters

Each section in `ignore` accepts either:

- **`true`** - Hides the entire section from the rendered resume.
- **An array of partial objects** - Hides only entries whose primitive fields match all specified values. For
  example, `{ "name": "Acme Corp", "position": "Intern" }` ignores only the entry where both fields match.

Supported fields per section:

| Section           | Matchable fields                                                                         |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `work`            | `name`, `location`, `position`, `startDate`, `endDate`, `duration`, `summary`, `logoUrl` |
| `education`       | `name`, `area`, `studyType`, `startDate`, `endDate`, `logoUrl`                           |
| `projects`        | `name`, `description`, `startDate`, `endDate`, `entity`, `type`, `url`, `logoUrl`        |
| `skills`          | `name`                                                                                   |
| `languages`       | `language`, `fluency`                                                                    |
| `recommendations` | `name`, `headline`, `date`, `relationship`, `logoUrl`                                    |

## Requirements

- **Node.js** >= 18
- **Google Chrome** - Required for PDF generation (Windows only; uses headless Chrome at the default install path).
- **LinkedIn account** - You will be prompted to log in on first run.

## Uninstall

```sh
npm uninstall -g linkedin-resume
```

## License

Released under the [MIT License](./LICENSE).
