import request from "@/utils/request"
import type { YiYanResponseData } from "./type"

enum API {
    IKUUU_URL = 'https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d'
}

export const reqYiYan = () => request.get<any, YiYanResponseData>(API.IKUUU_URL)