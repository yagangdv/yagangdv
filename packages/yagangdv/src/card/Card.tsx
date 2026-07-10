import type { App, SlotsType } from "vue";
import {
  defineComponent,
} from "vue";

export interface CardEmitsProps {
  onClick?: CardEmits["click"];
}

export interface CardProps {
  href?: string;
  target?: "_self" | "_blank" | "_parent" | "_top" | string;
  autoInsertSpace?: boolean;
}

export type CardEmits = {
  click: (e: MouseEvent) => void;
}

export interface CardSlots {
  default?: () => any;
  icon?: () => any;
  loadingIcon?: () => any;
}

const defaultCardProps = {
} as any;

const InternalCompoundedCard = defineComponent<CardProps, CardEmits, string, SlotsType<CardSlots>>(
  (props = defaultCardProps, { attrs, slots, emit }) => {
    return () => {
      return <div>{slots.default?.()}</div>
    }
  },
  {
    name: "YagangCard",
    inheritAttrs: false,
  }
)

type CompoundedComponent = typeof InternalCompoundedCard & {
  /** @internal */
  __YAGANG_CARD: boolean;
};

const Card = InternalCompoundedCard as CompoundedComponent;

Card.__YAGANG_CARD = true;

(Card as any).install = (app: App) => {
  app.component(InternalCompoundedCard.name, Card);
};

export default Card;
