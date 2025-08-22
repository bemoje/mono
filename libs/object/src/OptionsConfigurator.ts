/* eslint-disable @typescript-eslint/no-explicit-any */

import type { SetFieldType, Simplify, RequiredKeysOf, OptionalKeysOf } from 'type-fest'
import { KindGuard, ReturnType, Static, TObject, TSchema, Type } from '@sinclair/typebox'
import { entriesOf } from './entriesOf'
import { keysOf } from './keysOf'

/**
 * A utility function to configure options based on a given schema or properties.
 * This function provides a builder pattern to define and validate options,
 * including handling default values, required keys, and optional keys.
 *
 * @template P - A record type representing the schema or properties.
 *
 * @param schemaOrProps - The schema or properties to configure options.
 * It can either be an object schema (`TObject<P>`) or a plain object (`P`).
 *
 * @returns A builder function that allows creating and validating options.
 * The builder function includes the following properties:
 * - `schemaProps`: The properties of the schema.
 * - `schema`: The full schema object.
 * - `defaults`: A map of default value functions for optional properties.
 * - `cast`: A utility function to cast a value to the options type.
 * - `create`: A function to create a new configurator instance.
 * - `build`: A recursive reference to the builder function itself.
 *
 * @example ````ts
 *  const props = {
 *   name: Type.String(),
 *   age: Type.Integer(),
 *   city: Type.String(),
 *   state: Type.Optional(Type.String({ default: () => 'WA' })),
 *   disabled: Type.Optional(Type.Boolean()),
 * }
 *
 * const configurator = OptionsConfigurator(props)
 *
 * const options = configurator((o) => {
 *   return o
 *     .name('Alice') //
 *     .age(2)
 *     .city('Seattle')
 *     .done()
 * })
 *
 * console.log(options)
 * //=> { state: 'WA', name: 'Alice', age: 2, city: 'Seattle' }
 * ```
 */
export function OptionsConfigurator<P extends Record<string, TSchema>>(schemaOrProps: P | TObject<P>) {
  const props = KindGuard.IsObject(schemaOrProps) ? schemaOrProps.properties : schemaOrProps
  const schema = KindGuard.IsObject(schemaOrProps) ? schemaOrProps : Type.Object(props)

  type Options = Static<typeof schema>

  const defaults = entriesOf(props).reduce(
    (acc, [key, prop]) => {
      if ('default' in prop) {
        Reflect.set(
          acc,
          key,
          (typeof prop.default === 'function' ? prop.default : () => prop.default) as () => Options[keyof Options],
        )
      }
      return acc
    },
    {} as Partial<Record<keyof Options, () => Options[keyof Options]>>,
  )

  const requiredKeys = schema.required as RequiredKeysOf<Options>[]
  const optionalKeys = Object.keys(props).filter(
    (k) => !requiredKeys.includes(k as never),
  ) as OptionalKeysOf<Options>[]

  const create = createConfigurator<Options>({ defaults, requiredKeys, optionalKeys })

  const build = (callback: (builder: ReturnType<typeof create>) => Options) => {
    const builder = create()
    const options = callback(builder)
    return options
  }

  build.getSchemaProps = () => props
  build.getSchema = () => schema
  build.getDefaults = () => defaults
  build.cast = (v?: unknown) => v as Options
  build.getCreate = () => create
  build.getBuild = () => build

  return build
}

/**
 * Creates a configurator class for managing options with defaults, required keys, and optional keys.
 * The configurator allows setting values, applying defaults for missing values, and retrieving the final configuration.
 */
function createConfigurator<
  T extends Record<string, any>,
  K extends keyof T = keyof T,
  V extends T[K] = T[K],
>(options: {
  defaults: Partial<Record<K, () => V>>
  requiredKeys: RequiredKeysOf<T>[]
  optionalKeys: OptionalKeysOf<T>[]
}) {
  class CFG<Opts extends T> {
    constructor(readonly $data: Partial<Opts>) {}

    /**
     * Applies defaults for missing values and then returns data.
     */
    done() {
      this.applyDefaults()
      return this.$data
    }

    /**
     * Set default values for missing keys.
     */
    protected applyDefaults() {
      entriesOf(options.defaults).forEach(([key, dfValue]) => {
        if (this.$data[key] === undefined) {
          const df = dfValue?.()
          if (df !== undefined) {
            this.$data[key] = dfValue?.()
          }
        }
      })
      return this
    }
  }

  // all property keys
  const keys = new Set([...options.requiredKeys, ...keysOf(options.defaults), ...options.optionalKeys] as K[])

  // add accessor methods to prototype
  for (const key of keys) {
    Object.defineProperty(CFG.prototype, key, {
      value: function (this: CFG<T>, value: T[typeof key]) {
        if (value === undefined) {
          if (key in options.defaults) {
            if (typeof options.defaults[key] === 'function') {
              this.$data[key] = options.defaults[key]()
            } else {
              this.$data[key] = options.defaults[key] as T[typeof key]
            }
          } else {
            delete this.$data[key]
          }
        } else {
          this.$data[key] = value
        }
        return new CFG(this.$data)
      },
    })
  }

  return function configurator() {
    const ins = new CFG({})
    return ins as TConfigurator<T>
  }
}

/**
 * @example ```ts
 * type _T = TConfigurator<{ a: number; b?: number }>
 * const _t: _T = {} as _T
 * _t.a((1))
 * ```
 */
type TConfigurator<
  T extends Record<string, any>,
  O extends Record<keyof T, any> = Record<keyof T, undefined>,
> = Simplify<DataProp<T, O> & AllAccessors<T, O> & DoneMethod<T, O>>

type _T = TConfigurator<{ a: number; b?: number }>
const _t: _T = {} as _T

// type RequiredAccessors<
//   T extends Record<string, any>, //
//   O extends Record<keyof T, any>,
// > = {
//   [K in keyof Required<PickRequired<T>>]: (
//     value: T[K],
//   ) => ConfiguratorRecursive<Omit<T, K>, SetFieldType<O, K, T[K]>>
// }

// type OptionalAccessors<
//   T extends Record<string, any>, //
//   O extends Record<keyof T, any>,
// > = {
//   [K in keyof Required<PickOptional<T>>]: (
//     value: T[K],
//   ) => ConfiguratorRecursive<Omit<T, K>, SetFieldType<O, K, T[K]>>
// }

type AllAccessors<
  T extends Record<string, any>, //
  O extends Record<keyof T, any>,
> = {
  [K in keyof Required<T>]: (value: T[K]) => TConfigurator<Omit<T, K>, SetFieldType<O, K, T[K]>>
}

type DoneMethod<
  T extends Record<string, any>, //
  O extends Record<keyof T, any>,
> = {
  /**
   * Applies defaults for missing values and then returns data.
   */
  done(): Simplify<Omit<T, keyof O> & O>
}

type DataProp<
  T extends Record<string, any>, //
  O extends Record<keyof T, any>,
> = {
  /**
   * Returns data without applying defaults for missing values.
   */
  $data: Simplify<Omit<T, keyof O> & O>
}

// /**
//  * Determine if all required keys are defined.
//  */
// type AllRequiredDefined<
//   T extends Record<string, any>, //
//   O extends Record<string, any>,
// > = RequiredKeysOf<T> extends RequiredKeysOf<DefinedKeys<O>> ? O : never

// /**
//  * Omit all props that have value === undefined.
//  */
// type DefinedKeys<
//   T extends Record<string, any>, //
// > = {
//   [K in keyof T as T[K] extends undefined ? never : K]: T[K]
// }
