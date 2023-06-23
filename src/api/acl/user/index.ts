// 用户管理模块的接口
import request from "@/utils/request"
import type { UserResponseData, User } from "./type"

enum API {
    // 获取全部已有用户账号信息
    ALLUSER_URL = '/admin/acl/user/',
    // 添加一个新的用户账号
    ADDUSER_URL = '/admin/acl/user/save',
    // 更新已有的用户账号信息
    UPDATEUSER_URL = '/admin/acl/user/update'
}

// 获取用户账号信息的接口
export const reqUserInfo = (page: number, limit: number) => request.get<any, UserResponseData>(API.ALLUSER_URL + `${page}/${limit}`)

// 添加用户与更新用户的接口
export const reqAddOrUpdateUser = (data: User) => {
    // 携带参数有ID更新
    if (data.id) {
        return request.put<any, any>(API.UPDATEUSER_URL, data)
    } else {
        return request.post<any, any>(API.ADDUSER_URL, data)
    }
}