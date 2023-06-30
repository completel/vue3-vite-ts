<template>
    <div>
        <el-card>
            <el-form :inline="true">
                <el-form-item label="职位搜索">
                    <el-input placeholder="请你输入搜索职位的关键字" v-model="keyword"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" :disabled="!keyword" @click="serach">搜索</el-button>
                    <el-button type="success" @click="reset">重置</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card style="margin: 10px 0">
            <el-button type="primary" icon="Plus" @click="addRole">添加职位</el-button>
            <el-table border style="margin: 10px 0" :data="allRole">
                <el-table-column type="index" align="center" label="#"></el-table-column>
                <el-table-column label="ID" align="center" prop="id"></el-table-column>
                <el-table-column label="职位名称" align="center" show-overflow-tooltop prop="roleName"></el-table-column>
                <el-table-column label="创建时间" align="center" show-overflow-tooltop prop="createTime"></el-table-column>
                <el-table-column label="更新时间" align="center" show-overflow-tooltop prop="updateTime"></el-table-column>
                <el-table-column label="操作" align="center">
                    <!-- row：已有的职位对象 -->
                    <template #="{ row }">
                        <el-button type="primary" size="small" icon="User" @click="setPermisstion(row)">分配权限</el-button>
                        <el-button type="success" size="small" icon="Edit" @click="updateRole(row)">编辑</el-button>
                        <el-popconfirm :title="`你确定要删除${row.roleName}？`" width="260px" @confirm="removeRole(row.id)">
                            <template #reference>
                                <el-button type="danger" size="small" icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
                :background="true" layout="prev, pager, next, jumper, ->, total, sizes" :total="total"
                @current-change="getHasRole" @size-change="sizeChange" />
        </el-card>
        <!-- 添加职位与更新已有职位的结构：对话框 -->
        <el-dialog v-model="dialogVisite" :title="RoleParams.id ? '更新职位' : '添加职位'">
            <el-form :model="RoleParams" :rules="rules" ref="form">
                <el-form-item label="职位名称" prop="roleName">
                    <el-input placeholder="请你输入职位名称~" v-model="RoleParams.roleName"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisite = false">取消</el-button>
                    <el-button type="primary" @click="save">确定</el-button>
                </span>
            </template>
        </el-dialog>
        <!-- 抽屉组件：分配用户的职位菜单权限与按钮权限 -->
        <el-drawer v-model="drawer">
            <template #header>
                <h4>分配权限</h4>
            </template>
            <template #default>
                <div>
                    <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all
                        :default-checked-keys="selectArr" :props="defaultProps" />
                </div>
            </template>
            <template #footer>
                <div style="flex: auto">
                    <el-button @click="drawer = false">取消</el-button>
                    <el-button type="primary" @click="handler">确定</el-button>
                </div>
            </template>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from 'vue'
import { ElMessage, FormRules } from 'element-plus'
import { reqAllRoleList, reqAddOrUpdate, reqAllMenuList, reqSetPerMisstion, reqRemoveRole } from '@/api/acl/role'
// 引入骨架仓库
import useLayOutSettingStore from '@/store/module/settins'
import type { RoleResponseData, Records, RoleData, MenuList } from '@/api/acl/role/type'

// 获取仓库
const settingStore = useLayOutSettingStore()
// 当前页码
const pageNo = ref<number>(1)
// 一夜展示几条数据
const pageSize = ref<number>(10)
// 搜索职位关键字
const keyword = ref<string>('')
// 存储全部已有的职位
const allRole = ref<Records>([])
// 职位总个数
const total = ref<number>(0)
// 控制对话框的显示与隐藏
const dialogVisite = ref<boolean>(false)
// 收集新增岗位数据
const RoleParams = reactive<RoleData>({
    roleName: ''
})
// 获取form组件实例
const form = ref<any>()
// 抽屉显示与隐藏
const drawer = ref<boolean>(false)
// 定义数据存储用户权限的数据
const menuArr = ref<MenuList>([])
// 准备一个数组：数组用于存储勾选的节点的id（四级）
const selectArr = ref<number[]>([])
// 树形结构ref
const tree = ref()
// 树形结构
const defaultProps = {
    children: 'children',
    label: 'name',
}

// 获取全部用户信息的方法|分页器当前页码发生变化的回调
const getHasRole = async (pager = 1) => {
    // 修改当前页码
    pageNo.value = pager
    const result: RoleResponseData = await reqAllRoleList(pageNo.value, pageSize.value, keyword.value)
    if (result.code == 200) {
        total.value = result.data.total
        allRole.value = result.data.records
    }
}
// 下拉菜单
const sizeChange = () => {
    getHasRole()
}
// 搜索按钮回调
const serach = () => {
    // 再次发送请求根据关键字
    getHasRole()
}
// 重置按钮回调
const reset = () => {
    settingStore.refsh = !settingStore.refsh
}
// 添加职位按钮回调
const addRole = () => {
    dialogVisite.value = true
    // 清空数据
    Object.assign(RoleParams, {
        roleName: '',
        id: 0
    })
    // 清空上一次表单错误情况
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}
// 更新已有职位按钮的回调
const updateRole = (row: RoleData) => {
    // 显示出对话框
    dialogVisite.value = true
    // 存储已有的职位带有ID
    Object.assign(RoleParams, row)
    // 清空上一次表单错误情况
    nextTick(() => {
        form.value.clearValidate('roleName')
    })
}
const validatorRoleName = (_: any, value: string, callback: any) => {
    if (value.trim().length >= 2) {
        callback()
    } else {
        callback(new Error('职位名称必须大于或等于2位'))
    }
}
// 职位校验规则
const rules: FormRules = {
    roleName: [
        { required: true, trigger: 'blur', validator: validatorRoleName }
    ]
}
// 对话框确定按钮回调
const save = async () => {
    // 表单校验规则，结果通过再发请求，没有通过不用发送请求
    await form.value.validate()
    // 添加职位|或者更新职位的请求
    const result = await reqAddOrUpdate(RoleParams)
    if (result.code == 200) {
        // 提示信息
        ElMessage({
            type: 'success',
            message: RoleParams.id ? '更新成功' : '添加成功'
        })
        // 对话框关闭
        dialogVisite.value = false
        // 再次更新已有的职位
        getHasRole(RoleParams.id ? pageNo.value : 1)
    }
}
// 分配权限按钮回调
const setPermisstion = async (row: RoleData) => {
    // 抽屉显示出来
    drawer.value = true
    // 收集当前要分配权限职位的数据
    Object.assign(RoleParams, row)
    // 更具职位获取权限数据
    const result = await reqAllMenuList(RoleParams.id as number)
    if (result.code == 200) {
        menuArr.value = result.data
        selectArr.value = filterSelectArr(menuArr.value, [])
    }
}
const filterSelectArr = (allData: MenuList, initArr: number[]) => {
    allData.forEach(item => {
        if (item.select && item.level === 4) {
            initArr.push(item.id)
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    })
    return initArr
}
// 抽屉确定按钮回调
const handler = async () => {
    // 职位的id
    const roleId = RoleParams.id as number
    // 选中的id
    const arr = tree.value.getCheckedKeys()
    // 半选的id
    const arr1 = tree.value.getHalfCheckedKeys()
    const permissionId = arr.concat(arr1)
    // 下发权限
    const result = await reqSetPerMisstion(roleId, permissionId)
    if (result.code == 200) {
        // 抽屉关闭
        drawer.value = false
        ElMessage({
            type: 'success',
            message: '分配权限成功'
        })
        // 页面刷新
        window.location.reload()
    }
}
// 删除已有的职位
const removeRole = async (id: number) => {
    const result = await reqRemoveRole(id)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除职位成功'
        })
        getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
    }
}

onMounted(() => {
    getHasRole()
})


</script>

<style scoped></style>