// 路由鉴权，项目当中路由能不能被访问的权限的设置（某一个路由什么条件下可以访问，什么条件下不能访问）
import router from "@/router"
// 引入封装了一下的进度条
import { start, done } from '@/utils/NProgress'

// 全局守卫：项目当中任意路由切换都会触发的狗子
// 全局前置守卫
router.beforeEach((to, from, next) => {
    // to：你将要访问哪个路由
    // from：你从哪个路由来
    // next：路由的放行函数
    start()
    console.log(11)
    next()
    // 如果什么都没有，undefined 或返回 true，则导航是有效的，并调用下一个导航守卫
    // return true;
})

// 全局后置守卫
router.afterEach(() => {
    done()
    console.log(22)
})

// 第一个问题：任意路由切换实现进度条业务 --nprogress