// 对外暴露配置路由
export default [
    {
        // 登录
        path: '/login',
        // 命名路由
        name: 'login',
        component: () => import('@/views/Login/index.vue'),
        meta: {
            title: '登录', // 菜单标题
            hidden: true, // 代表路由标题在菜单中是否隐藏 true隐藏|false不隐藏
            icon: 'Promotion' // 菜单文字左侧的图标，支持element-plus全部图标
        }
    },
    {
        // 登录成功以后展示数据页面
        path: '/',
        name: 'layout',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '',
            hidden: false, // 代表路由标题在菜单中是否隐藏 true隐藏|false不隐藏
            icon: ''
        },
        redirect: '/home',
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    hidden: false, // 代表路由标题在菜单中是否隐藏 true隐藏|false不隐藏
                    icon: 'HomeFilled'
                }
            }
        ]
    },
    // 数据大屏
    {
        path: '/screen',
        name: 'Screen',
        component: () => import('@/views/screen/index.vue'),
        meta: {
            hidden: false,
            title: '数据大屏',
            icon: 'Platform'
        }
    },
    // 权限管理
    {
        path: '/acl',
        name: 'Acl',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '权限管理',
            icon: 'Lock'
        },
        redirect: '/acl/user',
        children: [
            {
                path: '/acl/user',
                name: 'User',
                component: () => import('@/views/acl/user/index.vue'),
                meta: {
                    title: '用户管理',
                    icon: 'User'
                }
            },
            {
                path: '/acl/role',
                name: 'Role',
                component: () => import('@/views/acl/role/index.vue'),
                meta: {
                    title: '角色管理',
                    icon: 'UserFilled'
                }
            },
            {
                path: '/acl/permission',
                name: 'Permission',
                component: () => import('@/views/acl/permission/index.vue'),
                meta: {
                    title: '菜单管理',
                    hidden: false,
                    icon: 'Monitor'
                }
            }
        ]
    },
    // 商品管理
    {
        path: '/product',
        name: 'Product',
        component: () => import('@/layout/index.vue'),
        meta: {
            title: '商品管理',
            icon: 'Goods'
        },
        redirect: '/product/trademark',
        children: [
            {
                path: '/product/trademark',
                name: 'Trademark',
                component: () => import('@/views/product/trademark/index.vue'),
                meta: {
                    title: '品牌管理',
                    icon: 'ShoppingCartFull'
                }
            },
            {
                path: '/product/attr',
                name: 'Attr',
                component: () => import('@/views/product/attr/index.vue'),
                meta: {
                    title: '属性管理',
                    icon: 'ChromeFilled'
                }
            },
            {
                path: '/product/spu',
                name: 'Spu',
                component: () => import('@/views/product/spu/index.vue'),
                meta: {
                    title: 'SPU管理',
                    icon: 'Calendar'
                }
            },
            {
                path: '/product/sku',
                name: 'Sku',
                component: () => import('@/views/product/sku/index.vue'),
                meta: {
                    title: 'SKU管理',
                    icon: 'Orange'
                }
            }
        ]
    },
    {
        // 404路由
        path: '/404',
        name: '404',
        component: () => import('@/views/404/index.vue'),
        meta: {
            title: '404',
            hidden: true, // 代表路由标题在菜单中是否隐藏 true隐藏|false不隐藏
            icon: 'Camera'
        }
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'Any',
        redirect: '/404',
        meta: {
            title: '任意路由',
            hidden: true, // 代表路由标题在菜单中是否隐藏 true隐藏|false不隐藏
            icon: 'Van'
        }
    }
]