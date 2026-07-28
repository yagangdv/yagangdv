import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Button from '..'

describe('button.Semantic', () => {
  it('should support classNames and styles', () => {
    const wrapper = mount(Button, {
      props: {},
      slots: {
        default: () => 'Test',
      },
    })

    expect(wrapper.find('.yagang-btn').exists()).toBe(true)
    expect(wrapper.text()).toBe('Test')
  })
})
