import { SemanticExtnamePrefix } from './SemanticExtnamePrefix'
import { valuesOf } from '@mono/object'
import { UnionToTuple } from 'type-fest'

/**
 * Array of all semantic extension prefixes used to categorize files by their purpose.
 */
export default valuesOf(SemanticExtnamePrefix) as UnionToTuple<SemanticExtnamePrefix>
