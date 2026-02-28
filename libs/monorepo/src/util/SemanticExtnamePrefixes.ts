import { SemanticExtnamePrefix } from './SemanticExtnamePrefix'
import type { UnionToTuple } from 'type-fest'

/**
 * Array of all semantic extension prefixes used to categorize files by their purpose.
 */
export default Object.values(SemanticExtnamePrefix) as unknown as UnionToTuple<SemanticExtnamePrefix>
