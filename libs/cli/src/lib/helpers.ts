import assertNoMultipleVariadicArguments from './helpers/assertNoMultipleVariadicArguments'
import assertNoOptionalOrVariadicArguments from './helpers/assertNoOptionalOrVariadicArguments'
import assertNoVariadicArgument from './helpers/assertNoVariadicArgument'
import assertOptionNameNotInUse from './helpers/assertOptionNameNotInUse'
import assertOptionShortNameIsValid from './helpers/assertOptionShortNameIsValid'
import assertOptionShortNameNotInUse from './helpers/assertOptionShortNameNotInUse'
import findOption from './helpers/findOption'
import findSubcommand from './helpers/findSubcommand'
import getCommandAncestors from './helpers/getCommandAncestors'
import getCommandAndAncestors from './helpers/getCommandAndAncestors'
import parseOptionFlags from './helpers/parseOptionFlags'

export const helpers = {
  assertNoMultipleVariadicArguments: assertNoMultipleVariadicArguments as typeof assertNoMultipleVariadicArguments,
  assertNoOptionalOrVariadicArguments:
    assertNoOptionalOrVariadicArguments as typeof assertNoOptionalOrVariadicArguments,
  assertNoVariadicArgument: assertNoVariadicArgument as typeof assertNoVariadicArgument,
  assertOptionNameNotInUse: assertOptionNameNotInUse as typeof assertOptionNameNotInUse,
  assertOptionShortNameIsValid: assertOptionShortNameIsValid as typeof assertOptionShortNameIsValid,
  assertOptionShortNameNotInUse: assertOptionShortNameNotInUse as typeof assertOptionShortNameNotInUse,
  findOption: findOption as typeof findOption,
  findSubcommand: findSubcommand as typeof findSubcommand,
  getCommandAncestors: getCommandAncestors as typeof getCommandAncestors,
  getCommandAndAncestors: getCommandAndAncestors as typeof getCommandAndAncestors,
  parseOptionFlags: parseOptionFlags as typeof parseOptionFlags,
}

export {
  assertNoMultipleVariadicArguments,
  assertNoOptionalOrVariadicArguments,
  assertNoVariadicArgument,
  assertOptionNameNotInUse,
  assertOptionShortNameIsValid,
  assertOptionShortNameNotInUse,
  findOption,
  findSubcommand,
  getCommandAncestors,
  getCommandAndAncestors,
  parseOptionFlags,
}
