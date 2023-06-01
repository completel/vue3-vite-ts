// 路由鉴权，项目当中路由能不能被访问的权限的设置（某一个路由什么条件下可以访问，什么条件下不能访问）
import router from "@/router"
// 引入封装了一下的进度条
import { start, done } from '@/utils/NProgress'
// 获取用户相关的小仓库内部token数据，去判断用户是否登录成功
import pinia from "@/store"
import useUserStore from "@/store/module/user"
import setting from "@/setting"
const userStore = useUserStore(pinia)

// 全局守卫：项目当中任意路由切换都会触发的狗子
// 全局前置守卫
router.beforeEach(async (to, _, next) => {
    // to：你将要访问哪个路由
    // from：你从哪个路由来
    // next：路由的放行函数
    start()
    // 获取token，去判断用户登录还是未登录
    const token = userStore.token
    // 获取用户的名字
    const username = userStore.username
    // 用户登录判断
    if (token) {
        // 登陆成功，访问login，不能访问，指向首页
        if (to.path == '/login') {
            next({ path: '/' })
        } else {
            // 登录成功访问其余放行（除了login路由）
            if (username) {
                // 放行
                next()
            } else {
                // 如果没有用户信息，在守卫这里发请求获取到了用户信息再放行
                try {
                    await userStore.userInfo()
                    next()
                } catch (error) {
                    // token过期，获取到用户信息
                    // 用户手动删除了本地存储
                    // 退出登录->用户相关的数据清空
                    await userStore.userLogout()
                    next({ path: '/login', query: { redirect: to.path } })
                }
            }
        }
    } else {
        // 用户未登录
        if (to.path == '/login') {
            next()
        } else {
            next({ path: '/login', query: { redirect: to.path } })
        }
    }
    // 如果什么都没有，undefined 或返回 true，则导航是有效的，并调用下一个导航守卫
    // return true;
})

// 全局后置守卫
router.afterEach((to) => {
    done()
    document.title = `${setting.title} - ${to.meta.title}`
})

// 第一个问题：任意路由切换实现进度条业务 --nprogress
// 第二个问题：路由鉴权（路由组件访问权限的设置）
// 全部的路由组件：登录|404|任意路由|首页|数据大屏|权限管理（三个子路由）|商品管理（三个子路由）

// 用户未登录：可以访问login，其余六个路由不能访问（指向login）
// 用户登录成功：不可以访问login【指向首页】，其余路由可以访问