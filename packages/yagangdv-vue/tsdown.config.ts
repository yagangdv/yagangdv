import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'tsdown'

export default defineConfig({
  plugins: [
    vueJsx(),
    vue(),
  ],
  entry: [
    'src/**/*.ts',
    'src/**/*.tsx',
    '!src/**/tests/*',
    '!src/**/*.test.ts',
    '!src/**/*.test.tsx',
  ],
  unbundle: true,
  format: 'es',
  inlineOnly: false,
  outExtensions() {
    return {
      js: '.js',
      dts: '.d.ts',
    }
  },
  clean: true,
  skipNodeModulesBundle: true,
  copy: [
    { from: 'src/button/style/index.css', to: 'dist/button/style/index.css' },
  ],
  external: [
    'vue',
  ],
})
