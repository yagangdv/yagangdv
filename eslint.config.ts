import type { Linter } from 'eslint'
import antfu from '@antfu/eslint-config'

const config = antfu(
  {
    markdown: false, // 关闭对 Markdown (*.md) 文件中内嵌代码块的检查
    formatters: {
      css: true, // 启用对 CSS 文件的自动排版与格式化
    },

    e18e: false, // 关闭 e18e (旨在清理和现代化前端依赖链) 规则检测

    pnpm: true, // 启用针对 pnpm 包管理规范的校验配置

    // ──── 全局自定义规则改写 (0 代表关闭该校验) ────
    rules: {
      'jsdoc/empty-tags': 0, // 允许在 JSDoc 注释中存在空的标签（如写了 @param 却没有添加文字描述）
      'node/prefer-global/process': 0, // 允许直接在全局作用域下使用内置的 process 环境变量对象，无须显式导入
      'regexp/no-unused-capturing-group': 0, // 允许在正则表达式中编写未在代码中消费的捕获组 "(...)"
      'no-template-curly-in-string': 0, // 允许在常规的单、双引号字符串中包含 "${}"，而不会触发 ESLint 视作“误写模板字符串”的报错
      'vue/no-template-shadow': 0, // 允许 Vue 模板中使用会产生遮蔽（Shadowing）效果的同名局部变量（如 v-for="item in items" 里 item 与父级变量重名）
      'vue/one-component-per-file': 0, // 允许在一个 .vue 文件中定义或编写多个 Vue 组件
      'style/quote-props': 0, // 允许对象属性名（Key）自由决定是否包裹引号（不强制统一格式）
      'test/prefer-lowercase-title': 0, // 允许在单元测试（Vitest）中，用大写字母或特殊字符开头编写测试标题名
      'pnpm/yaml-enforce-settings': 0, // 允许关闭对 pnpm-workspace.yaml 的强制约束设定
      'ts/consistent-type-definitions': 0, // 允许自由使用 type 或 interface（关闭强制一致性）
    },
  },
  {
    // ──── 忽略名单列表 (这些文件夹或文件的代码不参与 ESLint 流程) ────
    ignores: [
      'docs/icons/src/icons', // 忽略自动生成的 SVG 图标等海量静态资源包
      'docs/src/assets/yagangd.css', // 忽略该特定的全局 CSS 构建输出依赖
    ],
  },
  {
    // ──── 专门面向 非生产环境文件（如文档、演练场、测试）的宽松规则重载 ────
    files: [
      'docs/**/*', // 所有的官方文档页面和组件 Demo
      'tests/**/*', // 单元测试文件夹下的所有代码
      'docs/**/tests/**/*', // 编写在文档目录下的演示用例测试文件
      'playground', // 本地极速调试演练场
    ],
    rules: {
      'no-console': 0, // 允许在上述非生产测试环境中使用 console 命令（如 console.log/console.error）
      'no-restricted-globals': 0, // 允许这些文件使用系统限制的全局变量
      'no-irregular-whitespace': 0, // 允许输入非常规的空格（如排版格式需要或 Markdown 渲染需要的特殊占位符全角空格等）
    },
  },
) as Linter.Config

export default config
