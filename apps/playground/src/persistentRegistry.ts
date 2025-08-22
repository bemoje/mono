// persistentRegistry.ts
import { createStore } from 'zustand/vanilla'
import { writeFileSync, readFileSync, existsSync } from 'fs-extra'
import { join } from 'path'
import { Constructor } from 'type-fest'
import { ExtMap } from '@mono/map'

export interface Identifiable {
  id: string
}

// Global store type: map from classKey to array of Identifiable
interface RegistryState {
  entities: Record<string, Identifiable[]>
  addEntity: (classKey: string, entity: Identifiable) => void
  setAll: (all: Record<string, Identifiable[]>) => void
  getInstances: <T extends Identifiable = Identifiable>(classKey: string) => T[]
  getInstanceById: <T extends Identifiable = Identifiable>(classKey: string, id: string) => T | null
}

type PersistedState = {
  entities: Record<string, Identifiable[]>
}

const persistenceFile = join(__dirname, 'registry-state.json')

// Singleton registry store
export const registry = createStore<RegistryState>((set, get) => ({
  entities: {},
  addEntity: (classKey, entity) => {
    const current = get().entities[classKey] || []
    set({
      entities: {
        ...get().entities,
        [classKey]: [...current, entity],
      },
    })
  },
  setAll: (all) => set({ entities: all }),
  getInstances: <T extends Identifiable = Identifiable>(classKey: string) => {
    return (get().entities[classKey] || []) as T[]
  },
  getInstanceById: <T extends Identifiable = Identifiable>(classKey: string, id: string) => {
    return (get().entities[classKey]?.find((entity) => entity.id === id) || null) as T | null
  },
}))

// Load persisted data into registry
export function loadRegistry() {
  if (!existsSync(persistenceFile)) return
  const raw = readFileSync(persistenceFile, 'utf8')
  const parsed: PersistedState = JSON.parse(raw)
  registry.getState().setAll(parsed.entities)
}

// Save current registry to disk
export function saveRegistry() {
  const data: PersistedState = { entities: registry.getState().entities }
  writeFileSync(persistenceFile, JSON.stringify(data, null, 2))
}

export function clearRegistry() {
  registry.getState().setAll({})
  saveRegistry()
}

// Generic helper for classes to register themselves
export function createEntity<T extends Identifiable>(classKey: string, state: Omit<T, 'id'>): string {
  const id = crypto.randomUUID() as string
  const entity = { id, ...state }
  registry.getState().addEntity(classKey, entity)
  return id
}

export function getEntities<T extends Identifiable>(classKey: string): T[] {
  return registry.getState().getInstances<T>(classKey)
}
export function getEntityById<T extends Identifiable>(classKey: string, id: string): T {
  const entity = findEntityById<T>(classKey, id)
  if (!entity) {
    throw new Error(`Entity with id ${id} not found in class ${classKey}`)
  }
  return entity
}
export function findEntityById<T extends Identifiable>(classKey: string, id: string): T | null {
  return registry.getState().getInstanceById<T>(classKey, id)
}

export function deleteEntity(classKey: string, id: string): boolean {
  registry.setState((state) => ({
    entities: {
      ...state.entities,
      [classKey]: state.entities[classKey]?.filter((entity) => entity.id !== id) || [],
    },
  }))
  return true
}

export function getStateMethods<
  State extends Identifiable,
  Ins extends State = State,
  C extends Constructor<Ins> = Constructor<Ins>,
>(cls: C, factory: (state: string | Omit<State, 'id'>) => InstanceType<C>, className: string = cls.name) {
  type T = InstanceType<C>
  const instances = new ExtMap<string, T>()

  return {
    instances,
    getInstanceState(id: string): State {
      return getEntityById<State>(className, id)
    },

    getInstances(): T[] {
      return getEntities<T>(className).map((entity) => {
        return instances.getOrDefault(entity.id, () => factory(entity.id))
      }) as T[]
    },
    getInstance(id: string): T {
      return instances.getOrDefault(id, () => factory(getEntityById<T>(className, id))) as T
    },
    findInstance(id: string): T | null {
      const entity = findEntityById<State>(className, id)
      return entity ? factory(entity) : null
    },
    deleteInstance(id: string): boolean {
      deleteEntity(className, id)
      return instances.delete(id)
    },
    initInstance(state: string | Omit<State, 'id'>) {
      return typeof state === 'string' ? state : createEntity<State>(className, state)
    },
  }
}

// export function registerClass<T extends Identifiable>(className: string) {
//   class ASD implements Identifiable {
//     readonly id: string
//     constructor(state: string | Omit<State, 'id'>) {
//       this.id = BB.initInstance(state)
//     }
//   }

//   setName(className, ASD)
//   return ASD

//   // const statics = {
//   //   create: (arg: T['id'] | Omit<State, 'id'> | T) => {
//   //     const id = typeof arg === 'string' ? arg : createEntity<T>(cls.classKey, arg)
//   //     return instances.getOrDefault(id, () => new cls(id))
//   //   },
//   //   getInstances() {
//   //     return getEntities<T>(cls.classKey).map((entity) =>
//   //       instances.getOrDefault(entity.id, () => new cls(entity.id)),
//   //     )
//   //   },
//   //   getInstance(id: T['id']) {
//   //     return instances.getOrDefault(id, () => new cls(getEntityById<T>(cls.classKey, id).id))
//   //   },
//   //   findInstance(id: T['id']) {
//   //     const entity = findEntityById<T>(cls.classKey, id)
//   //     return entity ? new cls(entity.id) : null
//   //   },
//   //   deleteInstance(id: T['id']): boolean {
//   //     deleteEntity(cls.classKey, id)
//   //     return instances.delete(id)
//   //   },
//   // }
//   // return Object.assign(cls, statics) as Omit<typeof cls & typeof statics>
// }
