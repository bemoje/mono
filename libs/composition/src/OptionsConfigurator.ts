/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { KindGuard } from '@sinclair/typebox'
import type { OptionalKeysOf } from 'type-fest'
import type { RequiredKeysOf } from 'type-fest'
import { ReturnType } from '@sinclair/typebox'
import type { SetFieldType } from 'type-fest'
import type { SetOptional } from 'type-fest'
import type { Simplify } from 'type-fest'
import type { Static } from '@sinclair/typebox'
import type { TObject } from '@sinclair/typebox'
import type { TSchema } from '@sinclair/typebox'
import { Type } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'
import { assertValidSchema } from '@mono/tschema'
import { entriesOf } from '@mono/object'
import { keysOf } from '@mono/object'

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

// eslint-disable-next-line max-lines-per-function
export function OptionsConfigurator<
  const DefaultKey extends keyof Static<TObject<P>>,
  P extends Record<string, TSchema>,
>(schemaOrProps: P | TObject<P>, defaultKeys?: DefaultKey[]) {
  const props = KindGuard.IsObject(schemaOrProps) ? schemaOrProps.properties : (schemaOrProps as P)
  const schema = KindGuard.IsObject(schemaOrProps) ? schemaOrProps : Type.Object(props)

  type MergedOptions = Static<typeof schema>
  type Options = SetOptional<MergedOptions, DefaultKey>

  const defaults = entriesOf(props).reduce(
    (acc, [key, prop]) => {
      if ('default' in prop) {
        Reflect.set(
          acc,
          key,
          (typeof prop.default === 'function' ?
            prop.default
          : () => {
              return prop.default
            }) as () => Options[keyof Options]
        )
      }
      return acc
    },
    {} as Partial<Record<keyof Options, () => Options[keyof Options]>>
  )

  const requiredKeys = schema.required as RequiredKeysOf<Options>[]
  const optionalKeys = keysOf(props).filter((k) => {
    return !requiredKeys.includes(k as never)
  }) as OptionalKeysOf<Options>[]

  const create = createConfigurator<Options>({ defaults, requiredKeys, optionalKeys })

  const build = (callback: (builder: ReturnType<typeof create>) => Options) => {
    const builder = create()
    const options = callback(builder)
    return options as MergedOptions
  }

  build.getSchemaProps = () => {
    return props
  }
  build.getSchema = () => {
    return schema
  }
  build.getDefaults = () => {
    return defaults
  }
  build.getDefaultKeys = () => {
    return defaultKeys
  }
  build.cast = (v?: unknown) => {
    return v as MergedOptions
  }
  build.getCreate = () => {
    return create
  }
  build.getBuild = () => {
    return build
  }

  type Builder = Parameters<typeof build>[0]

  build.createFunction = <Ret>(func: (options: MergedOptions) => Ret) => {
    function fn(options: Options): Ret
    function fn(builder: Builder): Ret
    function fn(arg0: Options | Builder) {
      const options = (typeof arg0 === 'function' ? build(arg0) : Value.Default(schema, arg0)) as MergedOptions
      assertValidSchema(schema, options, 'Invalid options')
      return func(options)
    }
    if (func.name) {
      Object.defineProperty(fn, 'name', { value: func.name, configurable: true })
    }
    Object.defineProperty(fn, 'OptionsConfigurator', {
      get() {
        return build
      },
      enumerable: true,
    })
    return fn as typeof fn & { get OptionsConfigurator(): typeof build }
  }

  build.createBaseClass = () => {
    return class Base {
      static get OptionsConfigurator() {
        return build
      }

      readonly options: MergedOptions

      constructor(options: Options)
      constructor(builder: Builder)
      constructor(arg0: Options | Builder) {
        this.options = (typeof arg0 === 'function' ? build(arg0) : Value.Default(schema, arg0)) as MergedOptions
        this.initialize()
      }

      /**
       * Called by the constructor
       */
      initialize() {
        this.assertValidOptions()
      }

      isValidOptions() {
        return Value.Check(schema, this.options)
      }

      assertValidOptions() {
        assertValidSchema(schema, this.options, 'Invalid options')
      }
    }
  }

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
            this.$data[key] = df
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
            this.$data[key] = options.defaults[key]!()
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
> = { [K in keyof Required<T>]: (value: T[K]) => TConfigurator<Omit<T, K>, SetFieldType<O, K, T[K]>> }

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
