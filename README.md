## 一. vite 运行常见报错

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

## 二. 使用`vite-plugin-svg-icons`插件

1. 安装 `npm i vite-plugin-svg-icons`  

2. 配置插件  

    1. 在`vite.config.ts`配置如下
    ```ts
    import { defineConfig } from 'vite'
    import vue from '@vitejs/plugin-vue'
    // 引入vite-plugin-svg-icons
    import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
    // 帮助您以独立于操作系统的方式使用文件系统路径
    import path from 'path'

    // https://vitejs.dev/config/
    export default defineConfig({
    plugins: [vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
      })
    ],
    resolve: {
        alias: {
          // 配置路径别名
          '@': path.resolve(__dirname, './src')
        }
      }
    })
    ```

    2. 在`src/main.ts`内引入注册脚本
    
    ```ts
    import 'virtual:svg-icons-register'
    ```
    
3. 如何使用
```vue
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    prefix?: string,
    name: string,
    color?: string
}

const props = withDefaults(defineProps<Props>(), {
    prefix: '#icon',
    // name: String,
    // color: String
})

const symbolId = computed(() => `${props.prefix}-${props.name}`)

</script>

<template>
    <h2>SVGICON</h2>
    <svg>
      <!-- x:link:href属性执行哪一个图标，属性值必须为#icon-图标名字 -->
      <!-- fill属性定义颜色 -->
      <use :xlink:href="symbolId" :fill="color"></use>
    </svg>
    <p>{{ prefix + name + color }}</p>
</template>

<style scoped></style>

```


## 三. 设置别名@

1. `vite.config.ts`增加如下配置
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// 引入vite-plugin-svg-icons
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 帮助您以独立于操作系统的方式使用文件系统路径
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/icons')],
      // 指定symbolId格式
      symbolId: 'icon-[dir]-[name]',
    })
  ],
  resolve: {
    alias: {
        // 配置路径别名
        '@': path.resolve(__dirname, './src')
    }
  }
})
```

2. `tsconfig.json`添加如下配置
```json
{
   "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

## 四. mock插件
1. 安装`vite-plugin-mock`和`mockjs`  
```shell
# vite-plugin-mock这个插件要装3.0以下版本
npm i mockjs vite-plugin-mock@2 
```

2. 在`vite.config.ts`中配置如下信息
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入vite-plugin-mock
import { viteMockServe } from 'vite-plugin-mock'

// mock插件提供方法
export default defineConfig(({ command }) => {
  return {
    plugins: [vue(),
    // mock
    viteMockServe({
      localEnabled: command === 'serve' // 保证在开发阶段可以使用mock接口
    }),
    ],
  }
})
```

3. 最后在根目录创建`mock`文件夹


## 五. 路由相关ts类型
1. 通过父组件给子组件传递路由信息  
```vue
<template>
  <Menu :menuList="userStore.routes"></Menu>
</template>

<script setup lang="ts">
// 获取用户相关的小仓库
import useUserStore from '@/sotre/module/user'
const userStore = useUserStore()

</script>
```

2. 子组件接收并定义ts类型  
``` vue
<script setup lang="ts" >
import type { RouteRecordRaw } from "vue-router"

interface Routers {
  menuList: Array<RouteRecordRaw>
}
// 获取父组件传递过来的全部路由数据
defineProps<Routers>()

</script>
```

3. `!`告知编译器此值不可能为空值
> 在定义`template`模板中使用`menuList`时，`meta`的类型是为定义的，所以通过`item.meta!.hidden`的形式


## 六. 遇到的问题
### 1. 在`src/views/product/trademark/index.vue`路径下遇到了以下问题
1. 计算属性计算出一个正确的网址格式，忽略了服务器会返回null这个问题
``` vue
<script lang='ts' setup>
const newImgUrl = computed(() => {
    return (row: TradeMark): string => {
        if (row.logoUrl == null) {
            return ''
        } else {
            return row.logoUrl.includes('http') ? row.logoUrl : `http://${row.logoUrl}`
        }
    }
})
</script>
```

2. 给路由组件添加了过渡动画，`src/layout/main/index.vue`，应该在对应的路由组件添加上根元素标签
```vue
<!-- 在路由组件src/views/product/trademark/index.vue -->
<template>
  <div>
    <el-card>
      ……
    </el-card>
    <el-dialog>
      ……
    </el-dialog>
  </div>
</template>
```

### 2. 作用域插槽给row定义ts类型
```vue
<template>
  <template #="{ row }: { row: Attr }">
      <el-tag 
        :type="tagColor(item.id as number)" 
        style="margin: 5px"
        v-for="item in row.attrValueList" 
        :key="item.id"
      >
        {{ item.valueName }}
      </el-tag>
  </template>
</template>

<script setup lang="ts">
  import type { Attr } from '@/api/product/attr/type'
</script>
```