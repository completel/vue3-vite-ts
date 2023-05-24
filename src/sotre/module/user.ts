// 创建用户相关小仓库
import { defineStore } from 'pinia'
// 引入接口
import { reqLogin } from '@/api/user'
// 引入数据类型
import type { logInForm, loginResponseData } from '@/api/user/type'
// 引入小仓库类型
import { UserState } from './types/type'
// 引入仓库本地存储的工具方法
import { SET_TOKEN, GET_TOKEN } from '@/utils/token'

const useUserStore = defineStore('user', {
    state: (): UserState => {
        return {
            token: GET_TOKEN(), // 用户唯一token
        }
    },
    // 异步|逻辑的地方
    actions: {
        // 用户登陆的方法
        async userLogin(data: logInForm) {
            // 登录请求
            const result: loginResponseData = await reqLogin(data)
            // 登录请求：成功200->token
            if (result.code === 200) {
                // pinia仓库存储一下token
                // 由于pinia|vuex存储数据其实利用数据对象
                this.token = result.data.token as string
                // 本地存储持久化存储一份
                SET_TOKEN(result.data.token as string)
                return 'ok'
            } else {
                // 登陆失败：失败201->登陆失败的错误信息
                return Promise.reject(new Error(result.data.message))
            }

        }
    },
    getters: {

    }
})

export default useUserStore