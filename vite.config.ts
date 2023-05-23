import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
// 引入svg需要用到插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// 引入vite-plugin-mock
import { viteMockServe } from 'vite-plugin-mock'

// https://vitejs.dev/config/
// mock插件提供方法
export default defineConfig(({ command }) => {
  return {
    plugins: [vue(),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]',
    }),
    // mock
    viteMockServe({
      localEnabled: command === 'serve' // 保证在开发阶段可以使用mock接口
    }),
    ],
    resolve: {
      alias: {
        "@": path.resolve("./src") // 相对路径别名配置，使用@代替src
      }
    },
    // sass全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
  }
})
