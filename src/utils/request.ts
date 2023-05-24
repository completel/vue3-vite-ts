// 进行axios二次封装：使用请求与相应拦截
import axios from 'axios'
import { ElMessage } from 'element-plus'
// 引入封装了一下的进度条
import { start, done } from '@/utils/NProgress';

// 利用axios对象的create方法，去创建axios实例（其它配置：基础路径、超时的时间）
const request = axios.create({
    // 基础路径
    baseURL: import.meta.env.VITE_APP_BASE_API, // 基础路径上会携带/api
    timeout: 5000, // 超时时间设置
});

// 第二步：request实例添加请求与相应拦截器
request.interceptors.request.use((config) => {
    start();
    // config配置对象，headers属性请求头，经常给服务器端，携带公共参数
    // 返回配置对象
    return config;
});

// 第三步
request.interceptors.response.use((response) => {
    done();
    // 成功回调
    // 简化数据
    return response.data;
}, (error) => {
    // 失败的回调：处理http网络错误
    // 定义一个变量
    let message = '';
    // http状态码
    let status = error.response.status;
    switch (status) {
        case 401:
            message = 'token过期'
            break;
        case 403:
            message = '无权访问'
            break;
        case 404:
            message = '请求地址错误'
            break;
        case 500:
            message = '服务器出点问题';
            break;
        default:
            message: '网络出现问题';
            break;
    }
    // 提示错误信息
    ElMessage({
        type: 'error',
        message
    });

    return Promise.reject(error);
});

// 对外暴露
export default request;