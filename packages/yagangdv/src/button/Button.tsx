import type { App, SlotsType } from "vue";
import {
  defineComponent,
} from "vue";

export interface ButtonEmitsProps {
  onClick?: ButtonEmits["click"];
}

export interface ButtonProps {
  href?: string;
  target?: "_self" | "_blank" | "_parent" | "_top" | string;
  autoInsertSpace?: boolean;
}

export type ButtonEmits = {
  click: (e: MouseEvent) => void;
}

export interface ButtonSlots {
  default?: () => any;
  icon?: () => any;
  loadingIcon?: () => any;
}

const defaultButtonProps = {
} as any;

const InternalCompoundedButton = defineComponent<ButtonProps, ButtonEmits, string, SlotsType<ButtonSlots>>(
  (props = defaultButtonProps, { attrs, slots, emit }) => {
    return () => {
      return <div>{slots.default?.()}</div>
    }
  },
  {
    name: "YagangButton",
    inheritAttrs: false,
  }
)

type CompoundedComponent = typeof InternalCompoundedButton & {
  /** @internal */
  __YAGANG_BUTTON: boolean;
};

const Button = InternalCompoundedButton as CompoundedComponent;

Button.__YAGANG_BUTTON = true;

(Button as any).install = (app: App) => {
  app.component(InternalCompoundedButton.name, Button);
};

export default Button;
