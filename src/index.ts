import Vue, { VueConstructor, PropOptions } from 'vue'

export type Prop<T> = { (): T } | { new (...args: any[]): T & object }

export type PropValidator<T> = PropOptions<T> | Prop<T> | Prop<T>[]

export type RecordPropsDefinition<T> = { [K in keyof T]: PropValidator<T[K]> }

export type ArrayPropsDefinition<T> = (keyof T)[]

export type PropsDefinition<T> =
  | ArrayPropsDefinition<T>
  | RecordPropsDefinition<T>

export interface AdapterOptions<Props> {
  props?: PropsDefinition<Props>
}

export function toVue<Props>(
  Ctor: any,
  options: AdapterOptions<Props> = {}
): VueConstructor<Props & Vue> {
  return Vue.extend<Vue, {}, {}, Props>({
    props: options.props as any,

    mounted() {
      const instance = ((this as any).instance = new Ctor({
        target: this.$el,
        data: this.$props
      }))

      patchSvelteInstance(this, instance)

      observePropsDiff(this, diff => {
        instance.set(diff)
      })
    },

    destroyed() {
      const { instance } = this as any
      instance.destroy()
    },

    render(h) {
      return h('div')
    }
  })
}

function noop(): void {
  // do nothing
}

function observePropsDiff(
  vm: Vue,
  cb: (diff: Record<string, any>) => void
): void {
  const props = vm.$props || {}
  const propKeys = Object.keys(props)
  let prevProps = copy(props)

  if (propKeys.length === 0) return

  vm.$watch(() => {
    const diff: Record<string, any> = {}

    propKeys.forEach(key => {
      const value = vm.$props[key]
      if (
        prevProps[key] !== value ||
        (value !== null && typeof value === 'object')
      ) {
        diff[key] = value
      }
    })

    if (Object.keys(diff).length > 0) {
      cb(diff)
      prevProps = copy(vm.$props || {})
    }
  }, noop)
}

function patchSvelteInstance(vm: Vue, svelte: any): void {
  const originalFire = svelte.fire
  svelte.fire = (eventName: string, data: any): void => {
    vm.$emit(eventName, data)
    return originalFire.call(svelte, eventName, data)
  }
}

function copy<T extends object>(value: T): T {
  return Object.keys(value).reduce<any>((acc, key) => {
    acc[key] = (value as any)[key]
    return acc
  }, {})
}
