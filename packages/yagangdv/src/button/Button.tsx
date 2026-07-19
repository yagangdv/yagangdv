import type { SlotsType } from 'vue'
import { defineComponent } from 'vue'

export interface ButtonEmitsProps {
  onClick?: ButtonEmits['click']
}

export interface ButtonProps {
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top' | string
  autoInsertSpace?: boolean
}

export type ButtonEmits = {
  click: (e: MouseEvent) => void
}

export interface ButtonSlots {
  default?: () => any
  icon?: () => any
  loadingIcon?: () => any
}

const Button = defineComponent<
  ButtonProps,
  ButtonEmits,
  string,
  SlotsType<ButtonSlots>
>(
  (_, { slots }) => {
    return () => {
      return <div class="yagang-button">{slots.default?.()}</div>
    }
  },
  {
    name: 'YagangButton',
    inheritAttrs: false,
  },
)

export default Button
