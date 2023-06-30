<template>
    <div>
        <el-table :data="PermisstionArr" stripe style="width: 100%; margin-bottom: 20px" row-key="id" border>
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="code" label="权限值" />
            <el-table-column prop="updateTime" label="修改时间" />
            <el-table-column label="操作">
                <!-- row就是每一个菜单的按钮对象 -->
                <template #="{ row }">
                    <el-button type="primary" :disabled="row.level == 4 ? true : false" @click="addPermisstion(row)">{{
                        row.level
                        == 3 ? "添加功能" : "添加菜单"
                    }}</el-button>
                    <el-button type="success" :disabled="row.level == 1 ? true : false"
                        @click="updatePermisstion(row)">编辑</el-button>
                    <el-popconfirm :title="`你确定要删除${row.name}吗？`" width="260px" @confirm="removeMenu(row.id)">
                        <template #reference>
                            <el-button type="danger" :disabled="row.level == 1 ? true : false">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!-- 对话框组件:添加或者更新已有的菜单属性 -->
        <el-dialog v-model="dialogVisible" :title="menuData.id ? '更新菜单' : '添加菜单'">
            <!-- 表单组件：收集新增或已有的菜单数据 -->
            <el-form label-width="60px">
                <el-form-item label="名称">
                    <el-input placeholder="请你输入菜单名称" v-model="menuData.name"></el-input>
                </el-form-item>
                <el-form-item label="权限值">
                    <el-input placeholder="请你输入权限值" v-model="menuData.code"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="save">
                        确定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { reqAllPermisstion, reqAddOrUpdateMenu, reqRemoveMenu } from '@/api/acl/menu'
import type { PermisstionResponseData, PermisstionList, Permisstion, MenuParams } from '@/api/acl/menu/type'
import { ElMessage } from 'element-plus';

// 存储菜单数据
const PermisstionArr = ref<PermisstionList>([])
// 控制对话框显示隐藏
const dialogVisible = ref<boolean>(false)
// 携带的参数
const menuData = reactive<MenuParams>({
    code: '',
    level: 0,
    name: '',
    pid: 0
})

// 获取菜单数据的方法
const getHasPermisstion = async () => {
    const result: PermisstionResponseData = await reqAllPermisstion()
    if (result.code == 200) {
        PermisstionArr.value = result.data
    }
}
// 添加菜单按钮的回调
const addPermisstion = (row: Permisstion) => {
    // 清空数据
    Object.assign(menuData, {
        id: 0,
        code: '',
        level: 0,
        name: '',
        pid: 0
    })
    dialogVisible.value = true
    // 收集新增的菜单的level数值
    menuData.level = row.level + 1
    // 给谁新增子菜单
    menuData.pid = row.id as number
}
// 编辑已有的菜单
const updatePermisstion = (row: Permisstion) => {
    dialogVisible.value = true
    // 收集已有的菜单数据进行更新
    Object.assign(menuData, row)
}
// 确定按钮的回调
const save = async () => {
    const result = await reqAddOrUpdateMenu(menuData)
    if (result.code == 200) {
        // 对话框隐藏
        dialogVisible.value = false
        // 提示信息
        ElMessage({
            type: 'success',
            message: menuData.id ? '更新成功' : '添加成功'
        })
        getHasPermisstion()
    }

}
// 删除按钮回调
const removeMenu = async (id: number) => {
    const result = await reqRemoveMenu(id)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功'
        })
        getHasPermisstion()
    }
}

onMounted(() => {
    getHasPermisstion()
})

</script>

<style scoped></style>