<template>
    <div>
        <Category :scene="scene"></Category>
        <el-card style="margin: 10px 0">
            <div v-show="scene == 0">
                <el-button type="primary" icon="Plus" :disabled="!categoryStore.c3Id" @click="addAttr">添加</el-button>
                <el-table border style="margin: 10px 0" :data="attrArr">
                    <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
                    <el-table-column label="属性名称" width="150px" prop="attrName"></el-table-column>
                    <el-table-column label="属性值名称">
                        <template #="{ row }: { row: Attr }">
                            <el-tag :type=" tagColor(item.id as number) " style="margin: 5px"
                                v-for=" item  in  row.attrValueList " :key=" item.id ">{{item.valueName}}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="150px">
                        <!-- row：代表已有属性对象 -->
                        <template #=" { } ">
                            <el-button type="primary" icon="Edit" @click=" updateAttr "></el-button>
                            <el-button type="danger" icon="Delete"></el-button>
                        </template>
                    </el-table-column>
                    <!-- 当数据为空时自定义的内容 -->

                </el-table>
            </div>
            <div v-show=" scene == 1 ">
                <!-- 展示添加属性与修改数据的结构 -->
                <el-form :inline=" true ">
                    <el-form-item label="属性名称">
                        <el-input placeholder="请你输入属性名称" v-model=" attrParams.attrName "></el-input>
                    </el-form-item>
                </el-form>
                <el-button type="primary" icon="Plus" :disabled=" !attrParams.attrName "
                    @click=" addAttrValue ">添加属性</el-button>
                <el-button type="primary" @click=" cancel ">取消</el-button>
                <el-table border style="margin: 10px 0" :data=" attrParams.attrValueList ">
                    <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
                    <el-table-column label="属性值名称">
                        <!-- row:即为当前属性值对象 -->
                        <template #=" { row } ">
                            <el-input placeholder="请属于属性值名称" v-model=" row.valueName "></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="属性值操作"></el-table-column>
                </el-table>
                <el-button type="primary" @click=" save ">保存</el-button>
                <el-button type="primary" @click=" cancel ">取消</el-button>
            </div>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
// 引入获取已有属性与属性值接口
import { reqAttr, reqAddOrUpdateAttr } from '@/api/product/attr'
import type { AttrResponseData, Attr } from '@/api/product/attr/type'
// 获取分类的仓库
import useCategoryStore from '@/store/module/category'
import { ElMessage } from 'element-plus'

// 存储已有的属性和属性值
let attrArr = ref<Attr[]>([])
// 定义卡片组件切换变量
let scene = ref<number>(0) // scene=0，显示table，scene=1，展示添加与修改属性结构
// 收集新增的属性数据
let attrParams = reactive<Attr>({
    attrName: '', // 新增的属性名字
    attrValueList: [ // 新增的属性值数组

    ],
    categoryId: '', // 三级分类的ID
    categoryLevel: 3 // 代表的是三级分类
})

const categoryStore = useCategoryStore()

/// 获取已有的属性和属性值方法
const getAttr = async () => {
    // 获取分类的id
    const { c1Id, c2Id, c3Id } = categoryStore;
    // 获取分类下的已有属性和属性值
    const result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
    if (result.code == 200) {
        attrArr.value = result.data
    }
}
// 添加属性按钮的回调
const addAttr = () => {
    // 每一次点击的时候，先清空以下数据再收集数据
    Object.assign(attrParams, {
        attrName: '',
        attrValueList: [],
        // 点击这个按钮的时候收集新增属性的三级分类id
        categoryId: categoryStore.c3Id,
        categoryLevel: 3
    })
    // 切换为添加|与修改属性的结构
    scene.value = 1
}
// table表格修改已有属性按钮和回调
const updateAttr = () => {
    scene.value = 1
}
// 取消按钮的回调
const cancel = () => {
    scene.value = 0
}
// 添加属性值回调
const addAttrValue = () => {
    // 点击添加属性值按钮的时候，向数组添加一个属性值对象
    attrParams.attrValueList.push({
        valueName: ''
    })
}
// 保存按钮的回调
const save = async () => {
    // 收集参数

    // 发请求
    const result = await reqAddOrUpdateAttr(attrParams)
    if (result.code == 200) {
        // 切换场景
        scene.value = 0
        // 提示信息
        ElMessage({
            type: 'success',
            message: attrParams.id ? '修改成功' : '添加成功'
        })
        // 获取全部已有的属性和属性值
        getAttr()
    } else {
        ElMessage({
            type: 'error',
            message: attrParams.id ? '修改失败' : '添加失败'
        })
    }
}

// 监视仓库三级分类ID变化
watch(() => categoryStore.c3Id, () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类得有才能发请求
    if (!categoryStore.c3Id) return
    getAttr()
})

// 计算属性，给el-tag不同的背景颜色
const tagColor = computed(() => {
    return (id: number) => {
        return id % 2 == 0 ? 'success' : 'warning'
    }
})

</script>

<style scoped></style>