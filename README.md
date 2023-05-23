## vite 运行常见报错

1. `tsconfig.json`中`moduleResolution`应该改成`node`。
2. `tsconfig.node.json`中`moduleResolution`也改成`node`。
3. `main.ts`中找不到模块`./App.vue`或其相应类型声明。  
   解决办法：`src`->`vite-env.d.ts`中添加
   ```ts
   declare module '*.vue' {
     import type { DefineComponent } from 'vue'
     const component: DefineComponent<{}, {}, any>
     export default component
   }
   ```
