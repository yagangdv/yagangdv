import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  build: {
    emptyOutDir: false,
    lib: {
      entry: 'src/index.ts',
      name: 'yagangdv',
      fileName: () => 'yagangdv.esm.js',
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        'vue',
      ],
      output: {
        globals: {
          'vue': 'vue',
        },
      },
    },
  },
})
