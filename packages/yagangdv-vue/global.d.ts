export {}

declare module 'vue' {
  export interface GlobalComponents {
    YButton: typeof import('yagangdv-vue')['Button']
  }
}
