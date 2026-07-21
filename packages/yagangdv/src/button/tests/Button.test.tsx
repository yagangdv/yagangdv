import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from '..'

describe('button', () => {
  it('should render default button', () => {
    const wrapper = mount(Button, {
      slots: {
        default: () => 'Button',
      },
    })
    expect(wrapper.find('.yagang-btn').exists()).toBe(true)
    expect(wrapper.text()).toBe('Button')
  })
})
