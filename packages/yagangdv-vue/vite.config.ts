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
      fileName: () => 'yagangdv.js',
      formats: ['umd'],
    },
    rollupOptions: {
      external: [
        'vue',
      ],
      output: {
        exports: 'named',
        globals: {
          'vue': 'Vue',
        },
      },
    },
  },
})
