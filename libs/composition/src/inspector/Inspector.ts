import colors from 'ansi-colors'
import lodash, { isObjectLike, mapValues } from 'lodash-es'
import { ClassInspectorMixin, IgnoreValuesOptions, InspectorOptions } from './types'
import { defineLazyProperty, defineMethod, defineValue, hasOwnProperty, hasProperty } from '@mono/object'
import { ignoreValuesFilterDefaults } from './defaults/ignoreValuesFilterDefaults'
import { inspectorDefaults } from './defaults/inspectorDefaults'
import { inspect, InspectOptions as NativeInspectOptions } from 'util'
import { getClassChain } from '@mono/object'
import { View } from '../View'

/**
 * Interface that target objects must implement to be inspectable.
 * Provides standard inspection methods for debugging and serialization.
 */
export interface InspectorTarget {
  [inspect.custom](depth: number, options: NativeInspectOptions): string
  get inspector(): Inspector
  toJSON(): Partial<this>
}

/**
 * Inspector provides customizable object inspection and serialization using the Composition pattern.
 * Composes target classes with inspection capabilities, allowing selective property display and custom formatting.
 */
export class Inspector extends View<InspectorTarget> {
  /**
   * Composes a class with Inspector capabilities by adding inspection methods to its prototype.
   * This follows the Composition pattern to extend classes without inheritance.
   */
  static compose(cls: ClassInspectorMixin, options: InspectorOptions = {}) {
    if (!hasProperty(cls.prototype, inspect.custom)) {
      defineMethod(
        cls.prototype,
        inspect.custom,
        function (this: InspectorTarget, depth?: number, options?: NativeInspectOptions) {
          return this.inspector.inspect(depth, options)
        },
      )
    }

    if (!hasProperty(cls.prototype, 'inspector')) {
      defineLazyProperty(cls.prototype, 'inspector', function get(this: InspectorTarget) {
        return new Inspector(this)
      })
    }

    if (!hasProperty(cls.prototype, 'toJSON')) {
      defineMethod(cls.prototype, 'toJSON', function (this: InspectorTarget) {
        return this.inspector.toObject()
      })
    }

    return options
  }

  /**
   * Compile the target object and return the output as an object.
   */
  toObject(depth = 0): Partial<InspectorTarget> {
    const result = mapValues(this.compile(depth).output, (value: unknown) => {
      if (!value) return value
      if (typeof value !== 'object') return value
      if (Array.isArray(value)) {
        return value.map((v) => {
          if ((v as InspectorTarget).inspector && (v as InspectorTarget).inspector instanceof Inspector) {
            return v.inspector.toObject(depth + 1)
          }
          return v
        })
      }
      if ((value as InspectorTarget).inspector && (value as InspectorTarget).inspector instanceof Inspector) {
        return (value as InspectorTarget).inspector.toObject(depth + 1)
      }
      return value
    })
    return { T: this.target.constructor.name, ...result } as Partial<InspectorTarget>
  }

  /**
   * Inspect the target object.
   */
  inspect(depth = 0, options: NativeInspectOptions = {}) {
    const { output, inspectOptions } = this.compile(depth)
    Object.assign(inspectOptions, options)
    if (depth !== 0) return output
    const result = inspect(output, options)
    return result.replace(/Object \[\w+\] \{/gm, (match) => {
      match = match.substring(8, match.length - 3)
      return `[${colors.magenta(match)}] {`
    })
  }

  /**
   * Compiles the output object and inspect options.
   * Merges prototype chain options and applies filters to determine which properties to include.
   */
  protected compile(depth = 0): { output: Partial<InspectorTarget>; inspectOptions: NativeInspectOptions } {
    const output = Object.defineProperty({}, Symbol.toStringTag, {
      value: this.target.constructor.name,
      configurable: true,
    }) as InspectorTarget

    const options = this.mergePrototypeOptions()

    const keys = new Set(options.keys)
    if (options.autoAddBooleanKeys) {
      const insBooleanValueKeys = Object.entries(this.target)
        .filter(([_key, value]) => typeof value === 'boolean')
        .map(([key]) => key)

      const protoGetterKeys = getClassChain(this.target)
        .map((cls) => {
          return Object.getOwnPropertyNames(cls.prototype).filter((key) => {
            return hasOwnProperty(Reflect.getOwnPropertyDescriptor(cls.prototype, key) ?? {}, 'get')
          })
        })
        .flat(2)

      const booleanKeys = insBooleanValueKeys
        .concat(protoGetterKeys)
        .filter((key) => /^(is|was|has|should)[A-Z]/.test(key))

      booleanKeys.forEach((key) => keys.add(key))
    }

    const ignoreFilters = Object.entries(options.ignoreValues)
      .filter(([_name, enabled]) => enabled)
      .map(([name]) => ignoreValuesFilterDefaults[name as keyof IgnoreValuesOptions])

    const objectValues: (() => void)[] = []
    const arrayValues: (() => void)[] = []
    for (const key of keys) {
      const value = this.target[key as keyof InspectorTarget]
      if (!ignoreFilters.every((filter) => filter(value))) continue
      if (!options.filters.every((filter) => filter.call(this.target, value, key, depth, output))) continue
      if (Array.isArray(value)) arrayValues.push(() => defineValue(output, key, value))
      else if (isObjectLike(value)) objectValues.push(() => defineValue(output, key, value))
      else defineValue(output, key, value)
    }
    objectValues.forEach((fn) => fn())
    arrayValues.forEach((fn) => fn())

    return { output, inspectOptions: options.inspect }
  }

  /**
   * Walks the prototype chain and merges Inspector options from all classes.
   * Subclass options override superclass options following inheritance semantics.
   */
  protected mergePrototypeOptions(): Required<InspectorOptions> {
    const defaults = this.getDefaults()
    let inspectOptions = defaults.inspect
    const keys = new Set<string | symbol>(defaults.keys)
    let autoAddBooleanKeys = defaults.autoAddBooleanKeys
    const ignoreKeys = new Set<string | symbol>(defaults.ignoreKeys)
    const ignoreValues = defaults.ignoreValues
    const customFilters = defaults.filters

    // walk prototype chain and collect options where defined
    const prototypeChainOptions = getClassChain(this.target.constructor)
      .reverse()
      .map((cls) => (cls as unknown as ClassInspectorMixin).inspector ?? {}) as InspectorOptions[]

    // iterate prototype and let the next subclass' options override its superclasses
    for (const options of prototypeChainOptions) {
      if (options.inspect) inspectOptions = { ...inspectOptions, ...options.inspect }
      options.keys?.forEach((elem) => keys.add(elem))
      if (options.autoAddBooleanKeys != null) autoAddBooleanKeys = options.autoAddBooleanKeys
      keys.forEach((elem) => ignoreKeys.delete(elem))
      options.ignoreKeys?.forEach((elem) => ignoreKeys.add(elem))
      ignoreKeys.forEach((elem) => keys.delete(elem))
      if (options.ignoreValues) Object.assign(ignoreValues, options.ignoreValues)
      options.filters?.forEach((filter) => customFilters.push(filter))
    }

    return {
      inspect: inspectOptions,
      ignoreValues,
      autoAddBooleanKeys,
      keys: Array.from(keys),
      ignoreKeys: Array.from(ignoreKeys),
      filters: customFilters,
    }
  }

  /**
   * Returns a deep clone of the default Inspector options.
   */
  protected getDefaults(): Required<InspectorOptions> {
    const filters = inspectorDefaults.filters.slice()
    const rest = lodash.cloneDeep(lodash.omit(inspectorDefaults, 'filters'))
    return { ...rest, filters }
  }
}
