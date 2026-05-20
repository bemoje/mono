import { createMethods } from './createMethods'
import { publishers } from 'apps/office/common/schema'

const methods = createMethods('publishers', publishers)

export const publishersRepo = {
  ...methods,
}
