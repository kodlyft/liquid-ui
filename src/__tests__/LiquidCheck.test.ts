import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import LiquidCheck from '../components/Forms/LiquidCheck.vue'

describe('LiquidCheck', () => {
  it('renders a real checkbox, so a form and a screen reader still see one', () => {
    const wrapper = mount(LiquidCheck, { props: { label: 'Header band' } })

    expect(wrapper.find('input[type=checkbox]').exists()).toBe(true)
    expect(wrapper.find('.lq-check__box').exists()).toBe(true)
    expect(wrapper.text()).toContain('Header band')
  })

  it('reflects modelValue in the is-checked class', async () => {
    const wrapper = mount(LiquidCheck, { props: { modelValue: false } })
    expect(wrapper.classes()).not.toContain('is-checked')

    await wrapper.setProps({ modelValue: true })

    expect(wrapper.classes()).toContain('is-checked')
    expect((wrapper.find('input').element as HTMLInputElement).checked).toBe(true)
  })

  it('emits update:modelValue and change when ticked', async () => {
    const wrapper = mount(LiquidCheck, { props: { modelValue: false } })

    await wrapper.find('input').setValue(true)

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true])
    expect(wrapper.emitted('change')?.[0]).toEqual([true])
  })

  it('is not clickable when disabled', () => {
    const wrapper = mount(LiquidCheck, { props: { disabled: true } })

    expect(wrapper.classes()).toContain('is-disabled')
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
  })

  /** `indeterminate` is a DOM property with no attribute behind it. */
  it('sets the indeterminate property on the input', async () => {
    const wrapper = mount(LiquidCheck, { props: { indeterminate: true } })
    const input = wrapper.find('input').element as HTMLInputElement

    expect(input.indeterminate).toBe(true)

    await wrapper.setProps({ indeterminate: false })

    expect(input.indeterminate).toBe(false)
  })

  it('stacks the box against the first line when a description is given', () => {
    const wrapper = mount(LiquidCheck, { props: { label: 'Pin', description: 'Keeps it down.' } })

    expect(wrapper.classes()).toContain('lq-check--stacked')
    expect(wrapper.find('.lq-check__hint').text()).toBe('Keeps it down.')
  })
})
