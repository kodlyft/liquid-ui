import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LiquidToggle from '../components/Forms/LiquidToggle.vue'

describe('LiquidToggle', () => {
  it('renders track and thumb', () => {
    const wrapper = mount(LiquidToggle)
    expect(wrapper.find('.lq-toggle__track').exists()).toBe(true)
    expect(wrapper.find('.lq-toggle__thumb').exists()).toBe(true)
  })

  it('reflects modelValue in is-on class', async () => {
    const wrapper = mount(LiquidToggle, { props: { modelValue: false } })
    expect(wrapper.classes()).not.toContain('is-on')
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.classes()).toContain('is-on')
  })

  it('emits update:modelValue and change on click', async () => {
    const wrapper = mount(LiquidToggle, { props: { modelValue: false } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('does nothing when disabled', async () => {
    const wrapper = mount(LiquidToggle, { props: { modelValue: false, disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('applies color modifier class', () => {
    const wrapper = mount(LiquidToggle, { props: { color: 'orange' } })
    expect(wrapper.classes()).toContain('lq-toggle--orange')
  })
})
