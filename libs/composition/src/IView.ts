/**
 * Interface for a View that wraps a target object.
 * View methods are redirected to the wrapped object which acts as
 * a surrogate 'this'.
 *
 * To create a method that redirects to 'target', @see {@link defineProxifiedPrototypeProperty}
 */
export interface IView<T extends object> {
  readonly target: T
}
