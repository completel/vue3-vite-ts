// 通过vue-router插件实现路由配置
import { createRouter, createWebHistory } from 'vue-router'
// createWebHashHistory hash模式
// createWebHistory history模式
import routes from './routes';
// 引入封装了一下的进度条
import { start, done } from '@/utils/NProgress';

// 创建路由器
const router = createRouter({
    // 路由模式
    history: createWebHistory(),
    routes,
    // 滚动行为
    scrollBehavior() {
        return {
            left: 0,
            top: 0
        }
    }
})

// 全局前置守卫
router.beforeEach(() => {
    start();
    // 如果什么都没有，undefined 或返回 true，则导航是有效的，并调用下一个导航守卫
    return true;
})

// 全局后置钩子
router.afterEach(() => {
    done();
})

export default router;