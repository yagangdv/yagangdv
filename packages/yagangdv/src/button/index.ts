import type { App } from 'vue'
import Button from './Button';

(Button as any).install = (app: App) => {
  app.component(Button.name, Button)
}

export type { ButtonEmits, ButtonProps, ButtonSlots } from './Button'

export default Button
