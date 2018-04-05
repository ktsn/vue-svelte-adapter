import Vue, { VNode } from 'vue'
import { mount } from '@vue/test-utils'
import { toVue } from '../src/index'
import Basic from './fixtures/Basic.html'
import Data from './fixtures/Data.html'
import ObjectData from './fixtures/ObjectData.html'
import Event from './fixtures/Event.html'
import CheckDestroy from './fixtures/CheckDestroy.html'

describe('Vue Svelte Adapter', () => {
  it('renders template', () => {
    const BasicVue = toVue(Basic)
    const wrapper = mount(BasicVue)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('ports Vue props to Svelte data', () => {
    const DataVue = toVue(Data, {
      props: {
        message: String
      }
    })
    const wrapper = mount(DataVue, {
      propsData: {
        message: 'Test Message'
      }
    })
    expect(wrapper.text()).toBe('Message: Test Message')
  })

  it('updates Svelte data when props are updated', () => {
    const DataVue = toVue(Data, {
      props: {
        message: String
      }
    })
    const wrapper = mount(DataVue, {
      propsData: {
        message: 'Test'
      }
    })
    wrapper.setProps({
      message: 'Updated'
    })
    expect(wrapper.text()).toBe('Message: Updated')
  })

  it('updates Svelte data when object props are mutated', () => {
    const DataVue = toVue(ObjectData, {
      props: {
        user: Object
      }
    })
    const Wrapper = Vue.extend({
      data() {
        return {
          user: {
            name: 'Foo'
          }
        }
      },

      render(h): VNode {
        return h(DataVue, {
          props: {
            user: this.user
          }
        })
      }
    })
    const wrapper = mount(Wrapper)

    expect(wrapper.text()).toBe('Name: Foo')
    wrapper.vm.user.name = 'Bar'
    expect(wrapper.text()).toBe('Name: Bar')
  })

  it('observes component events', () => {
    const EventVue = toVue(Event)
    const wrapper = mount(EventVue)
    wrapper.find('button').trigger('click')
    expect(wrapper.emitted('test')[0]).toEqual(['clicked'])
  })

  it('teardowns Svelte component', () => {
    const spy = jest.fn()
    CheckDestroy.registerSpy(spy)

    const CheckDestroyVue = toVue(CheckDestroy)
    const wrapper = mount(CheckDestroyVue)

    expect(spy).not.toHaveBeenCalled()
    wrapper.destroy()
    expect(spy).toHaveBeenCalled()
  })
})
