# 从 0 到 1 搭建一个符合 antdv-next 标准的 Vue3 开源 UI 组件库

> **适合读者**：第一次做开源组件库的前端开发者  
> **技术栈**：Vue 3 + TypeScript + pnpm + tsdown + turbo + changesets + VitePress  
> **目标**：做出一个**可被社区使用、维护、贡献**的标准组件库  
> **参考标准**：Ant Design Vue Next（antdv-next）

---

## 前言

很多同学想做开源组件库，但往往卡在「工程配置」这一步：  
Monorepo 怎么拆？构建工具选啥？怎么发版？文档怎么写？

本文是一份**可直接照抄的实战教程**，完全对齐 **antdv-next** 的工程实践，带你从零搭建一个现代 Vue3 组件库。

---

## 一、环境准备

### 1. 环境要求

```bash
Node.js >= 18
pnpm >= 8
```

安装 pnpm（如未安装）：

```bash
npm i -g pnpm
```

### 2. 初始化项目

```bash
git init my-ui-lib
cd my-ui-lib
pnpm init
```

### 3. 根目录 `package.json`

```json
{
  "name": "my-ui-lib",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "test": "vitest run",
    "lint": "eslint . --fix",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  },
  "engines": {
    "node": ">=18"
  },
  "preinstall": "npx only-allow pnpm"
}
```

---

## 二、Monorepo 工作区配置

### 1. `pnpm-workspace.yaml`

```yaml
packages:
  - "packages/*"
  - "docs"
  - "playground"
```

### 2. 目录结构

```text
my-ui-lib/
├── packages/
│   └── my-ui/       # 核心组件库
├── docs/            # VitePress 文档站
├── playground/      # 本地调试用 Vue 项目
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
├── turbo.json
└── .changeset/
```

---

## 三、TypeScript 基础配置

### 1. 根目录 `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM"],
    "types": ["vite/client"]
  }
}
```

### 2. 组件包 `packages/my-ui/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "include": ["src/**/*.ts", "src/**/*.vue"],
  "exclude": ["dist", "node_modules"]
}
```

---

## 四、核心组件包（packages/my-ui）

### 1. `packages/my-ui/package.json`

```json
{
  "name": "my-ui",
  "version": "0.0.1",
  "main": "./dist/lib/index.js",
  "module": "./dist/es/index.mjs",
  "types": "./dist/types/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/es/index.mjs",
      "require": "./dist/lib/index.js",
      "types": "./dist/types/index.d.ts"
    }
  },
  "files": ["dist"],
  "sideEffects": false,
  "peerDependencies": {
    "vue": ">=3.3"
  },
  "scripts": {
    "build": "tsdown",
    "dev": "tsdown --watch"
  },
  "devDependencies": {
    "vue": "^3.4",
    "@vitejs/plugin-vue": "^5",
    "tsdown": "^0.4",
    "typescript": "^5"
  }
}
```

### 2. `tsdown.config.ts`

```ts
import { defineConfig } from 'tsdown'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  entry: 'src/index.ts',
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['vue'],
  plugins: [vue()],
  outDir: 'dist',
})
```

### 3. 编写第一个 Button 组件

#### `packages/my-ui/src/button/MyButton.vue`

```vue
<template>
  <button class="my-btn">
    <slot>按钮</slot>
  </button>
</template>

<script setup lang="ts">
defineOptions({ name: 'MyButton' })
</script>

<style scoped>
.my-btn {
  padding: 6px 16px;
  border-radius: 6px;
  border: 1px solid #d9d9d9;
  background: #fff;
  cursor: pointer;
}
</style>
```

#### `packages/my-ui/src/button/index.ts`

```ts
import MyButton from './MyButton.vue'

export { MyButton }
```

#### `packages/my-ui/src/index.ts`

```ts
export * from './button'
```

---

## 五、Playground 本地调试

```bash
cd playground
pnpm create vite . -- --template vue-ts
pnpm install
pnpm add "my-ui@link:../packages/my-ui"
```

### `playground/vite.config.ts`（推荐）

```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      'my-ui': resolve(__dirname, '../packages/my-ui/src/index.ts')
    }
  }
})
```

### `App.vue`

```vue
<script setup lang="ts">
import { MyButton } from 'my-ui'
</script>

<template>
  <MyButton>Hello UI Lib</MyButton>
</template>
```

---

## 六、Turbo 任务编排

### `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "persistent": true,
      "cache": false
    }
  }
}
```

---

## 七、版本管理与发版（开源必备）

### 初始化 Changesets

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

### 标准发版流程

```bash
pnpm changeset # 选择包 & 版本类型
pnpm version   # 更新版本号 & CHANGELOG
pnpm release   # 构建并发布
```

---

## 八、文档站（VitePress）

```bash
cd docs
pnpm init
pnpm add -D vitepress vue
```

### `docs/button.md`

```md
Button 按钮

<Demo>
  <MyButton>测试</MyButton>
</Demo>
```

---

## 九、完整执行顺序（照抄即可）

```bash
# 1. 初始化
pnpm init

# 2. 创建工作区
# 新建 pnpm-workspace.yaml 及目录结构

# 3. 安装根依赖
pnpm add -Dw turbo vitest eslint @changesets/cli

# 4. 安装组件库依赖
pnpm --filter my-ui add -D vue @vitejs/plugin-vue tsdown typescript

# 5. 构建
pnpm build

# 6. 本地验证
pnpm --filter playground dev

# 7. 发版前
pnpm changeset
pnpm version
```

---

## 十、总结与下一步

至此，你已经拥有了一个**符合 antdv-next 标准**的 Vue3 组件库雏形：

- ✅ Monorepo 架构
- ✅ 支持 ESM / CJS / Tree-Shaking
- ✅ 完整 TypeScript 类型
- ✅ 自动化发版
- ✅ 文档站
- ✅ 本地调试环境

### 推荐后续完善方向

- ✅ ESLint + Prettier + commitlint + husky
- ✅ CSS Variables 主题系统 & 暗黑模式
- ✅ 自动提取 Props 生成文档
- ✅ GitHub Actions CI / Release

---

> 如果你觉得这篇文章对你有帮助，欢迎关注我的博客，后续我会持续更新《开源 UI 组件库实战系列》。  
> 有问题欢迎在评论区交流 👋
