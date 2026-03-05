import type { AutocompleteMultiSelectOptions } from '@clack/prompts'
import { AutocompletePrompt } from '@clack/core'
import type { Key } from 'node:readline'
import type { Option } from '@clack/prompts'
import { S_BAR } from '@clack/prompts'
import { S_BAR_END } from '@clack/prompts'
import { S_CHECKBOX_INACTIVE } from '@clack/prompts'
import { S_CHECKBOX_SELECTED } from '@clack/prompts'
import colors from 'ansi-colors'
import { limitOptions } from '@clack/prompts'
import { styleText } from 'node:util'
import { symbol } from '@clack/prompts'

export class AutocompleteMultiselectPrompt<Value> extends AutocompletePrompt<Option<Value>> {
  constructor(opts: AutocompleteMultiSelectOptions<Value>) {
    super({
      options: opts.options,
      multiple: true,
      filter:
        opts.filter
        ?? ((search, opt) => {
          return getFilteredOption(search, opt)
        }),
      validate: (): Error | string | undefined => {
        if (opts.required && this.selectedValues.length === 0) {
          return 'Please select at least one item'
        }
        if (opts.validate) {
          return opts.validate(this.selectedValues)
        }
        return undefined
      },
      initialValue: opts.initialValues,
      signal: opts.signal,
      input: opts.input,
      output: opts.output,
      render: renderAutocompleteMultiselect(opts),
    })
  }

  start() {
    this.addReturnKeypressListener()
    this.addCtrlAKeypressListener()

    return this.prompt() as Promise<symbol | string[]>
  }

  protected addCtrlAKeypressListener() {
    this.input.on('keypress', (_, key: Key) => {
      if (key.name === 'a' && key.ctrl) {
          const allSelected = this.filteredOptions.every((option) => {
            return this.selectedValues.includes(option.value)
          })
          if (allSelected) {
            this.selectedValues.forEach((value) => {
              this.toggleSelected(value)
            })
          } else {
            this.filteredOptions.forEach((option) => {
              if (!this.selectedValues.includes(option.value)) {
                this.toggleSelected(option.value)
              }
            })
          }
        }
    })
  }

  protected addReturnKeypressListener() {
    this.input.on('keypress', (_, key: Key) => {
      if (key.name === 'return' && this.selectedValues.length === 0) {
          if (this.isNavigating) {
            if (this.focusedValue) {
              this.toggleSelected(this.focusedValue)
            }
          } else {
            this.filteredOptions.forEach((option) => {
              if (!this.selectedValues.includes(option.value)) {
                this.toggleSelected(option.value)
              }
            })
          }
        }
    })
  }
}

function getFilteredOption<T>(searchText: string, option: Option<T>): boolean {
  if (!searchText) {
    return true
  }
  const label = (option.label ?? String(option.value ?? '')).toLowerCase()
  const hint = (option.hint ?? '').toLowerCase()
  const value = String(option.value).toLowerCase()
  const term = searchText.toLowerCase()

  return label.includes(term) || hint.includes(term) || value.includes(term)
}

function formatOptionDefault<Value>(option: Option<Value>, active: boolean, selectedValues: Value[]) {
  const isSelected = selectedValues.includes(option.value)
  const label = option.label ?? String(option.value ?? '')
  // const hint = option.hint && focusedValue !== undefined && option.value === focusedValue ? ` ${option.hint}` : ''
  const hint = option.hint ? ` ${option.hint}` : ''
  const checkbox = isSelected ? styleText('green', S_CHECKBOX_SELECTED) : styleText('dim', S_CHECKBOX_INACTIVE)

  if (option.disabled) {
    return `${styleText('gray', S_CHECKBOX_INACTIVE)} ${styleText(['strikethrough', 'gray'], label)}`
  }
  if (active) {
    return `${checkbox} ${colors.underline.cyan(label)}${colors.gray(hint)}`
  }
  return `${checkbox} ${styleText('gray', label)}${colors.dim.gray(hint)}`
}

function renderAutocompleteMultiselect<Value>(opts: AutocompleteMultiSelectOptions<Value>) {
  return function render(this: AutocompleteMultiselectPrompt<Value>) {
    // Title and symbol
    const title = `${styleText('gray', S_BAR)}\n${symbol(this.state)}  ${opts.message}\n`

    // Selection counter
    const userInput = this.userInput
    const placeholder = opts.placeholder
    const showPlaceholder = userInput === '' && placeholder !== undefined

    // Search input display
    const searchText =
      this.isNavigating || showPlaceholder ?
        showPlaceholder ? placeholder
        : userInput // Just show plain text when in navigation mode
      : this.userInputWithCursor

    // Render prompt state
    switch (this.state) {
      case 'submit': {
        return `${title}${styleText('gray', S_BAR)}  ${styleText('dim', `${this.selectedValues.length} items selected`)}`
      }
      case 'cancel': {
        return `${title}${styleText('gray', S_BAR)}  ${styleText(['strikethrough', 'dim'], userInput)}`
      }
      default: {
        const barStyle = this.state === 'error' ? 'yellow' : 'cyan'
        // Instructions
        const instructions = [
          `${styleText('magenta', '↑/↓')} navigate`,
          `${styleText('magenta', 'Space')} (de)select`,

          `${styleText('magenta', 'Ctrl + A:')} (de)select all`,

          `${styleText('magenta', 'Enter:')} ${
            this.selectedValues.length > 0 ? 'confirm'
            : this.isNavigating ? 'select and confirm'
            : 'select all and confirm'
          }`,
        ].filter((s) => {
          return s !== undefined
        })

        // No results message
        const noResults =
          this.filteredOptions.length === 0 && userInput ?
            [`${styleText(barStyle, S_BAR)}  ${styleText('yellow', 'No matches')}`]
          : []

        const errorMessage =
          this.state === 'error' ? [`${styleText(barStyle, S_BAR)}  ${styleText('yellow', this.error)}`] : []

        // Calculate header and footer line counts for rowPadding
        const headerLines = [
          ...`${title}${styleText(barStyle, S_BAR)}`.split('\n'),
          `${styleText(barStyle, S_BAR)}  ${searchText}`,
          ...noResults,
          ...errorMessage,
        ]
        const footerLines = [
          `${styleText(barStyle, S_BAR)}  ${instructions.join(' | ')}`,
          styleText(barStyle, S_BAR_END),
        ]

        // Get limited options for display
        const displayOptions = limitOptions({
          cursor: this.cursor,
          options: this.filteredOptions,
          style: (option, active) => {
            return formatOptionDefault(option, active, this.selectedValues)
          },
          maxItems: opts.maxItems,
          output: opts.output,
          rowPadding: headerLines.length + footerLines.length,
        })

        // Build the prompt display
        return [
          ...headerLines,
          ...displayOptions.map((option) => {
            return `${styleText(barStyle, S_BAR)}  ${option}`
          }),
          ...footerLines,
        ].join('\n')
      }
    }
  }
}
