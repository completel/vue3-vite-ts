import { App } from 'vue'
// 引入项目中全部的全局组件
import SvgIcon from '@/components/SvgIcon/index.vue'
import Category from '@/components/Category/index.vue'
// 引入element-plus提供全部图表组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 全局对象
const allGloablComponent: { [key: string]: object } = {
    SvgIcon,
    Category
}

// 对外暴露插件对象
export default {
    // 务必叫做install方法
    install(app: App) {
        // 注册项目全部的全局组件
        Object.keys(allGloablComponent).forEach(key => {
            // 注册为全局组件
            app.component(key, allGloablComponent[key])
        })
        // 将element-plus提供的图标注册为全局组件
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}