import { Identifiable, createEntity, getEntityById, getEntities, getStateMethods } from './persistentRegistry'
import { loadRegistry } from './persistentRegistry'
import { lazyProp } from '@mono/decorators'

interface AAState extends Identifiable {
  createdAt: string
}

export class AA {
  private constructor(readonly id: string) {}

  static create(data: Omit<AAState, 'id' | 'createdAt'>): AA {
    const id = createEntity<AAState>('AA', { ...data, createdAt: new Date().toISOString() })
    return new AA(id)
  }

  static revive(id: string): AA {
    return new AA(id)
  }

  get state(): AAState {
    return getEntityById<AAState>('AA', this.id)
  }

  static getAllState(): AAState[] {
    return getEntities<AAState>('AA')
  }
}

interface BBState extends Identifiable {
  name: string
}

class BB implements Identifiable {
  @lazyProp
  static get state() {
    return getStateMethods<BBState, BB>(this, (state) => new BB(state))
  }

  readonly id: string
  constructor(state: string | Omit<BBState, 'id'>) {
    this.id = BB.state.initInstance(state)
  }

  get name(): string {
    return this.state.name
  }

  get state(): BBState {
    return getEntityById<BBState>('BB', this.id)
  }
}

loadRegistry()

console.log({ BB })

const bb1 = new BB({ name: 'example' })
console.log({ bb1 })

console.log({ getInstances: BB.state.getInstances() })
console.log({ states: BB.state.getInstances().map((inst) => inst.state) })
console.log({ getInstance: BB.state.getInstance(bb1.id) })
console.log({ entriesArray: BB.state.instances.entriesArray() })
console.log({ getInstanceState: BB.state.getInstanceState(bb1.id) })
console.log({ state: bb1.state })
console.log({ name: bb1.name })

// new BB({ name: 'one' })
// new BB({ name: 'two' })
// new BB({ name: 'three' })

// // Before exit
// saveRegistry()
