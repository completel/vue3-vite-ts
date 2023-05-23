// 对外暴露配置路由
export default [
    {
        // 登录
        path: '/login',
        // 命名路由
        name: 'login',
        component: () => import('@/views/Login/index.vue')
    },
    {
        // 登录成功以后展示数据页面
        path: '/',
        name: 'home',
        component: () => import('@/views/home/index.vue')
    },
    {
        // 404路由
        path: '/404',
        name: '404',
        component: () => import('@/views/404/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'Any',
        redirect: '/404',
    }
]