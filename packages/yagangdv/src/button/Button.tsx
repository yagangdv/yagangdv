import type { SlotsType } from "vue";
import { defineComponent } from "vue";

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
};

export interface ButtonSlots {
  default?: () => any;
  icon?: () => any;
  loadingIcon?: () => any;
}

const defaultButtonProps = {} as any;

const Button = defineComponent<
  ButtonProps,
  ButtonEmits,
  string,
  SlotsType<ButtonSlots>
>(
  (props = defaultButtonProps, { slots }) => {
    return () => {
      return <div>{slots.default?.()}</div>;
    };
  },
  {
    name: "YagangButton",
    inheritAttrs: false,
  },
);

export default Button;
