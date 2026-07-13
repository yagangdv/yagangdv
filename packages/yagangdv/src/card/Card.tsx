import type { SlotsType } from 'vue'
import { defineComponent } from 'vue'

export interface CardEmitsProps {
  onClick?: CardEmits['click']
}

export interface CardProps {
  href?: string
  target?: '_self' | '_blank' | '_parent' | '_top' | string
  autoInsertSpace?: boolean
}

export type CardEmits = {
  click: (e: MouseEvent) => void
}
export interface CardSlots {
  default?: () => any
  icon?: () => any
  loadingIcon?: () => any
}

const Card = defineComponent<
  CardProps,
  CardEmits,
  string,
  SlotsType<CardSlots>
>(
  (_, { slots }) => {
    return () => {
      return <div>{slots.default?.()}</div>
    }
  },
  {
    name: 'YagangCard',
    inheritAttrs: false,
  },
)

export default Card
