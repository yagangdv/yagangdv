import type { App, Plugin } from "vue";
import * as components from "./components";
export * from "./components";

const version = "1.0.0";
let prefix = "Yagang";
export default {
  setPrefix(newPrefix: string) {
    prefix = newPrefix;
  },
  install(app: App) {
    app.config.globalProperties._yagang_prefix = prefix;
    Object.keys(components).forEach((key) => {
      const component = (components as any)[key];
      if ("install" in component) {
        app.use(component);
      }
    });
  },
  version,
} as Plugin;

export { version };
