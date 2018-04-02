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

      const originalFire = instance.fire
      instance.fire = (eventName: string, data: any): void => {
        this.$emit(eventName, data)
        return originalFire.call(instance, eventName, data)
      }

      const propKeys = Object.keys(this.$props || {})
      let prevProps = copy(this.$props || {})

      if (propKeys.length > 0) {
        this.$watch(() => {
          const target: Record<string, any> = {}

          propKeys.forEach(key => {
            const value = this.$props[key]
            if (
              prevProps[key] !== value ||
              (value !== null && typeof value === 'object')
            ) {
              target[key] = value
            }
          })

          if (Object.keys(target).length > 0) {
            instance.set(target)
            prevProps = copy(this.$props || {})
          }
        }, noop)
      }
    },

    beforeDestroy() {
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

function copy<T extends object>(value: T): T {
  return Object.keys(value).reduce<any>((acc, key) => {
    acc[key] = (value as any)[key]
    return acc
  }, {})
}
