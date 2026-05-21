import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LiquidButton from '../components/Button/LiquidButton.vue'

describe('LiquidButton', () => {
  it('renders default slot content', () => {
    const wrapper = mount(LiquidButton, { slots: { default: 'Continue' } })
    expect(wrapper.text()).toContain('Continue')
    expect(wrapper.classes()).toContain('lq-btn--primary')
    expect(wrapper.classes()).toContain('lq-btn--md')
  })

  it('applies variant + size + rounded modifier classes', () => {
    const wrapper = mount(LiquidButton, {
      props: { variant: 'destructive', size: 'lg', rounded: 'md' },
    })
    expect(wrapper.classes()).toContain('lq-btn--destructive')
    expect(wrapper.classes()).toContain('lq-btn--lg')
    expect(wrapper.classes()).toContain('lq-btn--r-md')
  })

  it('emits click when not disabled', async () => {
    const wrapper = mount(LiquidButton)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', async () => {
    const wrapper = mount(LiquidButton, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('shows spinner when loading and hides icon', () => {
    const wrapper = mount(LiquidButton, { props: { loading: true, icon: 'play' } })
    expect(wrapper.find('.lq-btn__spinner').exists()).toBe(true)
    expect(wrapper.find('.lq-btn__icon').exists()).toBe(false)
  })
})
