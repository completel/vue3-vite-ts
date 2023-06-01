// 创建用户相关小仓库
import { defineStore } from 'pinia'
// 引入element-plus 消息提示
import { ElMessage } from 'element-plus'
// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 引入数据类型
import type { loginResponseData, userInfoResponseData } from '@/api/user/type'
// 引入小仓库类型
import { UserState } from './types/type'
// 引入仓库本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由（常量路由）
import routes from '@/router/routes'

const useUserStore = defineStore('user', {
    state: (): UserState => {
        return {
            token: GET_TOKEN(), // 用户唯一token
            routes, // 仓库存储生成菜单需要数组（路由）
            username: '',
            avatar: ''
        }
    },
    // 异步|逻辑的地方
    actions: {
        // 用户登陆的方法
        async userLogin(data: any) {
            // 登录请求
            const result: loginResponseData = await reqLogin(data)
            // 登录请求：成功200->token
            if (result.code === 200) {
                // pinia仓库存储一下token
                // 由于pinia|vuex存储数据其实利用数据对象
                this.token = result.data as string
                // 本地存储持久化存储一份
                SET_TOKEN(result.data as string)
                return 'ok'
            } else {
                // 登陆失败：失败201->登陆失败的错误信息
                return Promise.reject(new Error(result.data))
            }

        },
        // 获取用户信息的方法
        async userInfo() {
            // 获取用户的信息仓储到仓库中[用户头像、名字]
            const result: userInfoResponseData = await reqUserInfo()
            if (result.code == 200) {
                this.username = result.data.name
                this.avatar = result.data.avatar
                return 'ok'
            } else {
                ElMessage({
                    message: '获取用户信息失败，请退出登录重试一下~',
                    type: 'warning',
                })
                return Promise.reject(new Error(result.message))
            }
        },
        // 退出登录
        async userLogout() {
            const result = await reqLogout()
            if (result.code == 200) {
                // 目前没有mock接口：退出登录接口（通知服务器本地用户唯一唯一表示失效）
                this.token = ''
                this.username = ''
                this.avatar = ''
                REMOVE_TOKEN()
                return 'ok'
            } else {
                return Promise.reject(new Error(result.message))
            }

        }
    },
    getters: {

    }
})

export default useUserStore