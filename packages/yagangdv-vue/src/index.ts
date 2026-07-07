import type { App, Plugin } from 'vue'
import * as components from './components'

export * from './components'

const version = '1.0.0'

export default {
  install(app: App) {
    Object.keys(components).forEach((key) => {
      const component = (components as any)[key]
      if (component && 'install' in component) {
        app.use(component)
      }
    })
  },
  version,
} as Plugin

export {
  version,
}
