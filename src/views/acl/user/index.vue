<template>
    <div>
        <el-card>
            <el-form :inline="true">
                <el-form-item label="用户名：">
                    <el-input placeholder="请你输入搜索用户名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">搜索</el-button>
                    <el-button type="success">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin: 10px 0">
            <el-button type="primary" @click="addUser">添加用户</el-button>
            <el-button type="danger">批量删除</el-button>
            <!-- table展示用户信息 -->
            <el-table style="margin: 10px 0" border :data="userArr">
                <el-table-column type="selection" align="center"></el-table-column>
                <el-table-column label="#" align="center" type="index"></el-table-column>
                <el-table-column label="ID" align="center" prop="id"></el-table-column>
                <el-table-column label="用户名字" align="center" show-overflow-tooltip prop="username"></el-table-column>
                <el-table-column label="用户名称" align="center" show-overflow-tooltip prop="name"></el-table-column>
                <el-table-column label="用户角色" align="center" show-overflow-tooltip prop="roleName"></el-table-column>
                <el-table-column label="创建时间" align="center" show-overflow-tooltip prop="createTime"></el-table-column>
                <el-table-column label="更新时间" align="center" show-overflow-tooltip prop="updateTime"></el-table-column>
                <el-table-column label="操作" width="300px" align="center">
                    <template #="{ row }">
                        <el-button type="primary" icon="User" size="small">分配角色</el-button>
                        <el-button type="success" icon="User" size="small" @click="updateUser(row)">编辑</el-button>
                        <el-button type="danger" icon="User" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
                :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total"
                @current-change="getHasUser" @size-change="handler" />
        </el-card>
        <!-- 抽屉结构：完成添加新的用户账号|更新已有的账号信息 -->
        <el-drawer v-model="drawer">
            <!-- 头部的标题内容应该是动态的 -->
            <template #header>
                <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
            </template>
            <!-- 抽屉的身体部分 -->
            <template #default>
                <el-form :model="userParams" :rules="rules" ref="formRef">
                    <el-form-item label="用户姓名" prop="username">
                        <el-input placeholder="请你输入用户姓名" v-model="userParams.username"></el-input>
                    </el-form-item>
                    <el-form-item label="用户昵称" prop="name">
                        <el-input placeholder="请你输入用户昵称" v-model="userParams.name"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                        <el-input placeholder="请你输入用户密码" v-model="userParams.password"></el-input>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="cancel">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { reqUserInfo, reqAddOrUpdateUser } from '@/api/acl/user'
import type { FormRules } from 'element-plus'
import type { UserResponseData, Records, User } from '@/api/acl/user/type'

// 默认页码
let pageNo = ref<number>(1)
// 一页展示几条数据
let pageSize = ref<number>(5)
// 用户总个数
let total = ref<number>(0)
// 存储全部用户的数据
const userArr = ref<Records>([])
// 控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 收集用户信息的数据
const userParams = reactive<User>({
    username: '',
    name: '',
    password: ''
})
// 获取form组件实例
const formRef = ref()

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
    // 收集当前的页码
    pageNo.value = pager
    const result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value)
    if (result.code == 200) {
        total.value = result.data.total
        userArr.value = result.data.records
    }
}
// 分页器下拉菜单自定义事件回调
const handler = () => {
    getHasUser()
}
// 添加用户按钮的回调
const addUser = () => {
    // 抽屉显示出来
    drawer.value = true
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: ''
    })
    nextTick(() => {
        // 清除上一次的错误提示信息
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
        formRef.value.clearValidate('password')
    })
}
// 更新已有的用户按钮回调
// row:即为已有用户的账号信息
const updateUser = (row: User) => {
    // 抽屉显示出来
    drawer.value = true
    // 存储收集已有的账号信息
    Object.assign(userParams, row)
    nextTick(() => {
        // 清除上一次的错误提示信息
        formRef.value.clearValidate('username')
        formRef.value.clearValidate('name')
    })
}
// 保存按钮回调
const save = async () => {
    // 点击保存按钮的时候，务必需要表单全部符合条件再去发请求
    await formRef.value.validate()
    // 保存按钮：添加新的用户|更新已有的用户账号信息
    const result: any = await reqAddOrUpdateUser(userParams)
    console.log(result)
    // 添加或者更新成功
    if (result.code == 200) {
        // 关闭抽屉
        drawer.value = false
        ElMessage({
            type: 'success',
            message: userParams.id ? '更新成功' : '添加成功'
        })
        // 获取用户信息
        getHasUser(userParams.id ? pageNo.value : 1)
        // 浏览器自动刷新一次
        window.location.reload()
    } else {
        drawer.value = false
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '添加失败'
        })
    }
}
// 取消按钮的回调
const cancel = () => {
    // 关闭抽屉
    drawer.value = false
}
// 校验用户名字的回调
const validatorUsername = (_: any, value: string, callback: any) => {
    // 用户的名字和昵称长度至少5位
    if (value.trim().length >= 5) {
        callback()
    } else {
        callback(new Error('用户名字至少为5位'))
    }
}
const validatorName = (_: any, value: string, callback: any) => {
    // 用户昵称长度至少2位
    if (value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('用户昵称至少为5位'))
    }
}
const validatorPassword = (_: any, value: string, callback: any) => {
    // 用户的密码和昵称长度至少6位
    if (value.trim().length >= 5) {
        callback()
    } else {
        callback(new Error('用户密码至少为6位'))
    }
}
// 表单校验的规则对象
const rules: FormRules = {
    // 用户的名字
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    // 用户昵称
    name: [{ required: true, trigger: 'blur', validator: validatorName }],
    // 用户密码
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}

// 组件挂在完毕
onMounted(() => {
    getHasUser()
})

</script>

<style scoped></style>