import { createApp } from 'vue'
// 引入elementplus插件与样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// svg插件需要配置代码
import 'virtual:svg-icons-register'
// 配置element-plus国际化
// @ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import App from '@/App.vue'
// 引入自定义插件对象：注册整个项目全局组件
import gloalComponent from '@/components'
// 引入模板的全部样式
import '@/styles/index.scss'
import router from './router'
// 引入仓库
import pinia from './sotre'

// 获取应用实例对象
const app = createApp(App)
// 安装elementplus插件
app.use(ElementPlus, {
    locale: zhCn
})
// 安装自定义插件
app.use(gloalComponent)
// 注册模板路由
app.use(router)
// 注册仓库pinia
app.use(pinia)
// 将应用挂载到挂载点上
app.mount('#app')