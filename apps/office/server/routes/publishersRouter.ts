import { createRoutes } from './createRoutes'
import { publishers } from '../../common/schema'
import { publishersRepo } from '../repositories/publishersRepo'

export const publishersRouter = createRoutes('publishers', publishers, publishersRepo)
