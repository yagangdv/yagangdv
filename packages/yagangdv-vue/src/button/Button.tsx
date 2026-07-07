import type { App, PropType, CSSProperties } from 'vue'
import { computed, defineComponent } from 'vue'

export type ButtonType = 'primary' | 'default' | 'dashed' | 'link' | 'text'
export type ButtonSize = 'large' | 'middle' | 'small'

export interface ButtonProps {
  type?: ButtonType
  size?: ButtonSize
  danger?: boolean
  disabled?: boolean
  loading?: boolean
  onClick?: (e: MouseEvent) => void
  style?: CSSProperties
  class?: string
}

const Button = defineComponent({
  name: 'YButton',
  props: {
    type: {
      type: String as PropType<ButtonType>,
      default: 'default',
    },
    size: {
      type: String as PropType<ButtonSize>,
      default: 'middle',
    },
    danger: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    style: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    class: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, { slots, emit, attrs }) {
    const handleClick = (e: MouseEvent) => {
      if (props.disabled || props.loading) {
        e.preventDefault()
        return
      }
      emit('click', e)
    }

    const classes = computed(() => {
      const prefixCls = 'y-btn'
      return [
        prefixCls,
        `${prefixCls}-${props.type}`,
        `${prefixCls}-${props.size}`,
        {
          [`${prefixCls}-danger`]: props.danger,
          [`${prefixCls}-loading`]: props.loading,
          [`${prefixCls}-disabled`]: props.disabled,
        },
        props.class,
        attrs.class,
      ]
    })

    return () => {
      return (
        <button
          type="button"
          class={classes.value}
          style={[props.style, attrs.style as any]}
          disabled={props.disabled || props.loading}
          onClick={handleClick}
        >
          {props.loading && (
            <span class="y-btn-loading-icon">
              <svg
                class="y-loading-spinner"
                viewBox="0 0 1024 1024"
                width="1em"
                height="1em"
                fill="currentColor"
              >
                <path d="M512 1024c-282.77 0-512-229.23-512-512s229.23-512 512-512v128c-212.08 0-384 171.92-384 384s171.92 384 384 384 384-171.92 384-384h128c0 282.77-229.23 512-512 512z" />
              </svg>
            </span>
          )}
          <span class="y-btn-content">
            {slots.default?.()}
          </span>
        </button>
      )
    }
  },
})

;(Button as any).install = (app: App) => {
  app.component(Button.name as string, Button)
}

export default Button
