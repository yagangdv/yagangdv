# yagangdv-vue

Yagangdv Vue3 Component Library, developed in step with `antdv-next`.

## Features

- ⚡️ Built-in TypeScript, TSX, and Vue 3 template compiler
- 📦 Configured with `tsdown` and `vite` for modern high-performance bundle generation
- 🎨 Beautiful and standard styling definitions
- 🔩 Support global types definitions for Volar/VS Code VUE language tools

## Installation

```bash
pnpm install yagangdv-vue
```

## Usage

### Register globally

```typescript
import { createApp } from 'vue'
import YagangdvVue from 'yagangdv-vue'
import 'yagangdv-vue/dist/index.css' // Import style if needed
import App from './App.vue'

const app = createApp(App)
app.use(YagangdvVue)
app.mount('#app')
```

### Import individually

```vue
<script setup>
import { Button as YButton } from 'yagangdv-vue'
import 'yagangdv-vue/src/button/style/index.css' // Direct path styling
</script>

<template>
  <YButton type="primary">Primary Button</YButton>
</template>
```
