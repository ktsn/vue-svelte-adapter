import { mount } from '@vue/test-utils'
import { toVue } from '../src/index'
import Basic from './fixtures/Basic.html'

describe('Vue Svelte Adapter', () => {
  it('renders template', () => {
    const BasicVue = toVue(Basic)
    const wrapper = mount(BasicVue)
    expect(wrapper.html()).toMatchSnapshot()
  })
})
