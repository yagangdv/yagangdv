import type { App, CSSProperties, SlotsType } from "vue";
import { omit } from "es-toolkit";
import { toArray } from "es-toolkit/compat";
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  watch,
} from "vue";

export interface ButtonEmitsProps {
  onClick?: ButtonEmits["click"];
}

export interface ButtonProps {
  href?: string;
  target?: "_self" | "_blank" | "_parent" | "_top" | string;
  autoInsertSpace?: boolean;
}

export interface ButtonEmits {
  click: (e: MouseEvent) => void;
}

export interface ButtonSlots {
  default?: () => any;
  icon?: () => any;
  loadingIcon?: () => any;
}

const defaultButtonProps = {
  iconPlacement: "start",
  htmlType: "button",
  autoInsertSpace: undefined,
  disabled: undefined,
  size: undefined,
} as any;

const InternalCompoundedButton = defineComponent<
  ButtonProps,
  ButtonEmits,
  string,
  SlotsType<ButtonSlots>
>(
  (props = defaultButtonProps, { slots, attrs, emit }) => {
    // https://github.com/ant-design/ant-design/issues/47605
    // Compatible with original `type` behavior
    const mergedType = computed(() => props.type || "default");
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      loadingIcon: contextLoadingIcon,
      shape: contextShape,
      color: contextColor,
      variant: contextVariant,
      autoInsertSpace: contextAutoInsertSpace,
    } = useComponentBaseConfig(
      "button",
      props,
      ["autoInsertSpace", "variant", "shape", "color", "loadingIcon"],
      "btn",
    );
    const { classes, styles } = toPropsRefs(props, "classes", "styles");

    const mergedShape = computed(
      () => props.shape || contextShape.value || "default",
    );

    const parsedColorVariant = computed<ColorVariantPairType>(() => {
      const { color, variant, type, danger } = props;
      // >>>>> Local
      // Color & Variant
      if (color && variant) {
        return [color, variant];
      }
      // Sugar syntax
      if (type || danger) {
        const colorVariantPair = ButtonTypeMap[mergedType.value] || [];
        if (danger) {
          return ["danger", colorVariantPair[1]];
        }
        return colorVariantPair;
      }
      // >>> Context fallback
      if (contextColor?.value && contextVariant?.value) {
        return [contextColor.value, contextVariant.value];
      }
      return ["default", "outlined"];
    });

    const mergedColorVariant = computed<ColorVariantPairType>(() => {
      const [parsedColor, parsedVariant] = parsedColorVariant.value;
      if (props.ghost && parsedVariant === "solid") {
        return [parsedColor, "outlined"];
      }
      return [parsedColor, parsedVariant];
    });

    const mergedColor = computed(() => mergedColorVariant.value[0]);
    const mergedVariant = computed(() => mergedColorVariant.value[1]);

    const isDanger = computed(() => mergedColor.value === "danger");
    const mergedColorText = computed(() =>
      isDanger.value ? "dangerous" : mergedColor.value,
    );
    const mergedInsertSpace = computed(() => {
      return props?.autoInsertSpace ?? contextAutoInsertSpace?.value ?? true;
    });
    const [hashId, cssVarCls] = useStyle(prefixCls);
    const disabled = useDisabledContext();
    const mergedDisabled = computed(() => {
      return props?.disabled ?? disabled.value;
    });

    const loadingOrDelay = computed<LoadingConfigType>(() => {
      return getLoadingConfig(props.loading);
    });
    const innerLoading = shallowRef(loadingOrDelay.value.loading);
    const hasTwoCNChar = shallowRef(false);
    const buttonRef = shallowRef<HTMLButtonElement | HTMLAnchorElement>();
    const isMountRef = shallowRef(true);
    onMounted(() => {
      isMountRef.value = false;
      if (props.autoFocus && buttonRef.value) {
        buttonRef.value?.focus?.();
      }
    });
    onBeforeUnmount(() => {
      isMountRef.value = true;
    });
    let delayTimer: ReturnType<typeof setTimeout> | null = null;
    // Update loading state
    watch(
      [() => loadingOrDelay.value.delay, () => loadingOrDelay.value.loading],
      async (_new, _old, onCleanup) => {
        if (loadingOrDelay.value.delay > 0) {
          delayTimer = setTimeout(() => {
            delayTimer = null;
            innerLoading.value = true;
          }, loadingOrDelay.value.delay);
        } else {
          innerLoading.value = loadingOrDelay.value.loading;
        }
        onCleanup(() => {
          if (delayTimer) {
            clearTimeout(delayTimer);
            delayTimer = null;
          }
        });
      },
      {
        flush: "sync",
        immediate: true,
      },
    );

    watch(
      [mergedInsertSpace, buttonRef, mergedVariant],
      async () => {
        await nextTick();
        // FIXME: for HOC usage like <FormatMessage />
        if (!buttonRef.value || !mergedInsertSpace.value) {
          return;
        }
        const buttonText = buttonRef.value.textContent || "";
        const children = filterEmpty(slots?.default?.());
        const iconChildren = toArray(getSlotPropsFnRun(slots, props, "icon"));
        const needInserted =
          children.length === 1 &&
          iconChildren.length === 0 &&
          !isUnBorderedButtonVariant(mergedVariant.value);
        if (needInserted && isTwoCNChar(buttonText.trim())) {
          if (!hasTwoCNChar.value) {
            hasTwoCNChar.value = true;
          }
        } else if (hasTwoCNChar.value) {
          hasTwoCNChar.value = false;
        }
      },
      {
        immediate: true,
      },
    );

    // ========================= Events =========================
    const handleClick = (e: MouseEvent) => {
      // FIXME: https://github.com/ant-design/ant-design/issues/30207
      if (innerLoading.value || mergedDisabled.value) {
        e.preventDefault();
        return;
      }
      emit("click", e);
    };

    // ========================== Size ==========================
    const { compactSize, compactItemClassnames } = useCompactItemContext(
      prefixCls,
      direction,
    );

    const sizeClassNameMap = {
      large: "lg",
      small: "sm",
      middle: undefined,
      medium: undefined,
    };
    const sizeFullName = useSize<SizeType>(
      (ctxSize) => (props?.size ?? compactSize.value ?? ctxSize) as SizeType,
    );
    const mergedIconPlacement = computed(() => props?.iconPlacement ?? "start");
    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        type: mergedType.value,
        color: mergedColor.value,
        variant: mergedVariant.value,
        danger: isDanger.value,
        shape: mergedShape.value,
        size: sizeFullName.value,
        disabled: mergedDisabled.value,
        loading: innerLoading.value,
        iconPlacement: mergedIconPlacement.value,
      };
    });
    // ========================= Style ==========================
    const contextStyleRoot = useSemanticRootStyle(contextStyle);
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      ButtonClassNamesType,
      ButtonStylesType,
      ButtonProps
    >(
      useToArr(
        ...(props._skipSemantic
          ? [ref(), classes]
          : [contextClassNames, classes]),
      ),
      useToArr(
        ...(props._skipSemantic
          ? [ref(), styles]
          : [contextStyles, contextStyleRoot as any, styles]),
      ),
      useToProps(mergedProps),
    );
    return () => {
      const { loading } = props;
      const sizeCls = sizeFullName.value
        ? (sizeClassNameMap?.[sizeFullName.value] ?? "")
        : "";
      const iconChildren = getSlotPropsFnRun(slots, props, "icon");
      const hasIcon = !!iconChildren;
      const iconType = innerLoading.value ? "loading" : hasIcon;
      const children = filterEmpty(slots?.default?.());
      const needInserted =
        children.length === 1 &&
        !hasIcon &&
        !isUnBorderedButtonVariant(mergedVariant.value);
      const kids = children.length
        ? spaceChildren(
            children,
            needInserted && mergedInsertSpace.value,
            mergedStyles.value.content,
            mergedClassNames.value.content,
          )
        : null;

      const cls = classNames(
        prefixCls.value,
        hashId.value,
        cssVarCls.value,
        {
          [`${prefixCls.value}-${mergedShape.value}`]:
            mergedShape.value !== "default" && mergedShape.value,
          // Compatible with versions earlier than 5.21.0
          [`${prefixCls.value}-${mergedType.value}`]: mergedType.value,
          [`${prefixCls.value}-dangerous`]: props.danger,

          [`${prefixCls.value}-color-${mergedColorText.value}`]:
            mergedColorText.value,
          [`${prefixCls.value}-variant-${mergedVariant.value}`]:
            mergedVariant.value,
          [`${prefixCls.value}-${sizeCls}`]: sizeCls,
          [`${prefixCls.value}-icon-only`]: !children.length && !!iconType,
          [`${prefixCls.value}-background-ghost`]:
            props.ghost && !isUnBorderedButtonVariant(mergedVariant.value),
          [`${prefixCls.value}-loading`]: innerLoading.value,
          [`${prefixCls.value}-two-chinese-chars`]:
            hasTwoCNChar.value &&
            mergedInsertSpace.value &&
            !innerLoading.value,
          [`${prefixCls.value}-block`]: props.block,
          [`${prefixCls.value}-rtl`]: direction.value === "rtl",
          [`${prefixCls.value}-icon-end`]: mergedIconPlacement.value === "end",
        },
        compactItemClassnames.value,
        (attrs as any).class,
        props.rootClass,
        contextClassName.value,
        mergedClassNames.value.root,
      );

      const fullStyle: any[] = [mergedStyles.value.root, (attrs as any).style];
      const iconSharedProps = {
        class: mergedClassNames.value.icon,
        style: mergedStyles.value.icon,
      };

      /**
       * Extract icon node.
       * If there is a custom icon and not in loading state: show custom icon
       */
      const iconWrapperElement = (child: any) => (
        <IconWrapper prefixCls={prefixCls.value} {...iconSharedProps}>
          {child}
        </IconWrapper>
      );

      const defaultLoadingIconElement = (
        <DefaultLoadingIcon
          existIcon={hasIcon}
          prefixCls={prefixCls.value}
          loading={innerLoading.value}
          mount={isMountRef.value}
          {...iconSharedProps}
        />
      );

      // Resolve merged loading icon: slot > loading.icon > context loadingIcon
      const slotLoadingIcon = getSlotPropsFnRun(slots, {}, "loadingIcon");
      const propLoadingIcon =
        loading && typeof loading === "object" && loading.icon
          ? typeof loading.icon === "function"
            ? loading.icon()
            : loading.icon
          : null;
      const contextLoadingIconNode = getSlotPropsFnRun(
        {},
        {
          loadingIcon: contextLoadingIcon.value,
        },
        "loadingIcon",
      );
      const mergedLoadingIcon =
        slotLoadingIcon || propLoadingIcon || contextLoadingIconNode;

      /**
       * Using if-else statements can improve code readability without affecting future expansion.
       */
      let iconNode: any;
      if (hasIcon && !innerLoading.value) {
        iconNode = iconWrapperElement(iconChildren);
      } else if (innerLoading.value && mergedLoadingIcon) {
        iconNode = iconWrapperElement(mergedLoadingIcon);
      } else {
        iconNode = defaultLoadingIconElement;
      }
      const mergedHref = props.href;
      const htmlType = props.htmlType ?? "button";

      if (mergedHref !== undefined) {
        return (
          <a
            {...omit(attrs, ["class", "style"])}
            ref={buttonRef as any}
            class={[
              cls,
              { [`${prefixCls.value}-disabled`]: mergedDisabled.value },
            ]}
            style={fullStyle}
            href={mergedDisabled.value ? undefined : mergedHref}
            onClick={handleClick}
            target={props.target}
            aria-disabled={mergedDisabled.value}
          >
            {iconNode}
            {kids}
          </a>
        );
      }

      let buttonNodes = (
        <button
          {...omit(attrs, ["class", "style"])}
          ref={buttonRef as any}
          type={htmlType}
          class={cls}
          style={fullStyle}
          onClick={handleClick}
          disabled={mergedDisabled.value}
        >
          {iconNode}
          {kids}
          {compactItemClassnames.value ? (
            <CompactStyle prefixCls={prefixCls.value} />
          ) : null}
        </button>
      );
      if (!isUnBorderedButtonVariant(mergedVariant.value)) {
        buttonNodes = (
          <Wave component="Button" disabled={innerLoading.value}>
            {buttonNodes}
          </Wave>
        );
      }
      return buttonNodes;
    };
  },
  {
    name: "AButton",
    inheritAttrs: false,
  },
);
type CompoundedComponent = typeof InternalCompoundedButton & {
  /** @internal */
  __ANT_BUTTON: boolean;
};

const Button = InternalCompoundedButton as CompoundedComponent;

Button.__ANT_BUTTON = true;

(Button as any).install = (app: App) => {
  app.component(InternalCompoundedButton.name, Button);
};

export default Button;
