import { SemanticExtnamePrefix } from './SemanticExtnamePrefix'
import { UnionToTuple } from 'type-fest'

/**
 * Array of all semantic extension prefixes used to categorize files by their purpose.
 */
export default Object.values(SemanticExtnamePrefix) as UnionToTuple<SemanticExtnamePrefix>
