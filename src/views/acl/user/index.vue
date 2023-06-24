<template>
    <div>
        <el-card>
            <el-form :inline="true">
                <el-form-item label="用户名：">
                    <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="!keyword.length" @click="search">搜索</el-button>
                    <el-button type="success" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin: 10px 0">
            <el-button type="primary" @click="addUser">添加用户</el-button>
            <el-button type="danger" :disabled="!selectIdArr.length" @click="deleteSelectUser">批量删除</el-button>
            <!-- table展示用户信息 -->
            <el-table style="margin: 10px 0" border :data="userArr" @selection-change="selectChange">
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
                        <el-button type="primary" icon="User" size="small" @click="setRole(row)">分配角色</el-button>
                        <el-button type="success" icon="User" size="small" @click="updateUser(row)">编辑</el-button>
                        <el-popconfirm :title="`你确定要删除${row.username}吗？`" width="260px" @confirm="deleteUser(row.id)">
                            <template #reference>
                                <el-button type="danger" icon="User" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
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
        <!-- 抽屉结构：用于某一个已有的账号进行职位分配 -->
        <el-drawer v-model="drawer1">
            <template #header>
                <h4>分配角色</h4>
            </template>
            <template #default>
                <el-form>
                    <el-form-item label="用户的姓名">
                        <el-input v-model="userParams.username" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="职位列表">
                        <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                            @change="handleCheckAllChange">全选</el-checkbox>
                        <!-- 显示职位的复选框 -->
                        <el-checkbox-group v-model="userRole" @change="handleCheckedCitiesChange">
                            <el-checkbox v-for="role in allRole" :key="role" :label="role">
                                {{ role.roleName }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="drawer1 = false">取消</el-button>
                    <el-button type="primary" @click="confirmClick">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import useLayOutSettingStore from '@/store/module/settins'
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqRemoveUser, reqSelectUser } from '@/api/acl/user'
import type { FormRules } from 'element-plus'
import type { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type'

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
// 控制分配角色的显示与隐藏
let drawer1 = ref<boolean>(false)
// 存储全部职位的数据
const allRole = ref<AllRole>([])
// 当前用户已有的职位
const userRole = ref<AllRole>([])
// 收集顶部复选框全选数据
const checkAll = ref<boolean>(false)
// 控制顶部全部不确定的样式
const isIndeterminate = ref(true)
// 准备一个数组存储批量删除的用户id
const selectIdArr = ref<User[]>([])
// 定义响应式数据：收集用户输入进来的关键字
const keyword = ref<string>('')
// 获取模板setting仓库
const settingStore = useLayOutSettingStore()

// 获取全部已有的用户信息
const getHasUser = async (pager = 1) => {
    // 收集当前的页码
    pageNo.value = pager
    const result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
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
        // getHasUser(userParams.id ? pageNo.value : 1)
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
// 分配角色按钮的回调
const setRole = async (row: User) => {
    // 存储已有的用户信息
    Object.assign(userParams, row)
    // 获取全部职位的数据与当前用户已有的职位数据
    const result: AllRoleResponseData = await reqAllRole(userParams.id as number)
    if (result.code == 200) {
        // 存储全部的职位
        allRole.value = result.data.allRolesList
        // 存储当前用户已有的职位
        userRole.value = result.data.assignRoles
        // 抽屉显示出来
        drawer1.value = true
    }
}
// 顶部的全部复选框的change事件
const handleCheckAllChange = (val: boolean) => {
    // val: true(全选) | false(未全选)
    userRole.value = val ? allRole.value : []
    // 不确定的样式（确定样式）
    isIndeterminate.value = false
}
// 底部全部的复选框的change事件
const handleCheckedCitiesChange = (value: string[]) => {
    // 顶部复选框的勾选数据
    // 代表：勾选上的项目个数与全部的职位个数相同，顶部的复选框勾选上
    checkAll.value = value.length === allRole.value.length
    // 不确定的样式
    isIndeterminate.value = !(value.length === allRole.value.length)
}
// 确定按钮的回调（分配职位）
const confirmClick = async () => {
    // 收集参数
    const data: SetRoleData = {
        userId: userParams.id as number,
        roleIdList: userRole.value.map(item => item.id as number)
    }
    const result = await reqSetUserRole(data)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '分配职务成功'
        })
        // 关闭抽屉
        drawer1.value = false
        // 重新获取数据
        getHasUser(pageNo.value)
    }
}
// 删除某一个用户
const deleteUser = async (userId: number) => {
    const result = await reqRemoveUser(userId)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
// table复选框勾选的时候会触发的事件
const selectChange = (value: any) => {
    selectIdArr.value = value
}
// 批量删除按钮的回调
const deleteSelectUser = async () => {
    // 整理批量删除的参数
    const idList = selectIdArr.value.map(item => item.id as number)
    const result: any = await reqSelectUser(idList)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}
// 搜索按钮的回调
const search = () => {
    // 根据关键字获取用户的数据
    getHasUser()
    // 清空关键字
    keyword.value = ''
}
// 重置按钮
const reset = () => {
    settingStore.refsh = !settingStore.refsh
}

// 组件挂在完毕
onMounted(() => {
    getHasUser()
})

</script>

<style scoped></style>