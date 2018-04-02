import Vue, { VueConstructor } from 'vue'

export function toVue(Ctor: any): VueConstructor {
  return Vue.extend({
    mounted() {
      ;(this as any).instance = new Ctor({
        target: this.$el
      })
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
