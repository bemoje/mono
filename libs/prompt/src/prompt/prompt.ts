import { AutocompleteMultiselectPrompt } from './core/AutocompleteMultiselectPrompt'
import { AutocompletePrompt } from './core/AutocompletePrompt'
import { ConfirmPrompt } from './core/ConfirmPrompt'
import { DatePrompt } from './core/DatePrompt'
import { InvisiblePrompt } from './core/InvisiblePrompt'
import { ListPrompt } from './core/ListPrompt'
import { MultiselectPrompt } from './core/MultiselectPrompt'
import { NumberPrompt } from './core/NumberPrompt'
import { PasswordPrompt } from './core/PasswordPrompt'
import { SearchPrompt } from './core/SearchPrompt'
import { SelectPrompt } from './core/SelectPrompt'
import { TextPrompt } from './core/TextPrompt'
import { TogglePrompt } from './core/TogglePrompt'

export { AutocompleteMultiselectPrompt }
export { AutocompletePrompt }
export { ConfirmPrompt }
export { DatePrompt }
export { InvisiblePrompt }
export { ListPrompt }
export { MultiselectPrompt }
export { NumberPrompt }
export { PasswordPrompt }
export { SearchPrompt }
export { SelectPrompt }
export { TextPrompt }
export { TogglePrompt }

function text(message: string) {
  return new TextPrompt(message)
}
function number(message: string) {
  return new NumberPrompt(message)
}
function confirm(message: string) {
  return new ConfirmPrompt(message)
}
function password(message: string) {
  return new PasswordPrompt(message)
}
function invisible(message: string) {
  return new InvisiblePrompt(message)
}
function list(message: string) {
  return new ListPrompt(message)
}
function toggle(message: string) {
  return new TogglePrompt(message)
}
function select(message: string) {
  return new SelectPrompt(message)
}
function multiselect(message: string) {
  return new MultiselectPrompt(message)
}
function autocomplete(message: string) {
  return new AutocompletePrompt(message)
}
function autocompleteMultiselect(message: string) {
  return new AutocompleteMultiselectPrompt(message)
}
function date(message: string) {
  return new DatePrompt(message)
}
function search(message: string) {
  return new SearchPrompt(message)
}

export const prompt = {
  text,
  number,
  confirm,
  password,
  invisible,
  list,
  toggle,
  select,
  multiselect,
  autocomplete,
  autocompleteMultiselect,
  date,
  search,
}

export default prompt
