import type { RouteRecordRaw } from "vue-router"
// 定义user小仓库数据state类型
export interface UserState {
    token: string | null,
    routes: RouteRecordRaw[]
}