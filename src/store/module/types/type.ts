import type { RouteRecordRaw } from "vue-router"
import type { CategoryObj } from "@/api/product/attr/type"

// 定义user小仓库数据state类型
export interface UserState {
    token: string | null,
    routes: RouteRecordRaw[],
    username: string,
    avatar: string
}

// 定义分类仓库state对象的ts类型
export interface CategoryState {
    c1Id: number | string,
    c1Arr: CategoryObj[],
    c2Arr: CategoryObj[],
    c2Id: number | string,
    c3Arr: CategoryObj[],
    c3Id: number | string
}