<template>
    <el-form label-width="100px">
        <el-form-item label="SPU名称">
            <el-input placeholder="请您输入SPU名称" v-model="spuParams.spuName"></el-input>
        </el-form-item>
        <el-form-item label="SPU品牌">
            <el-select v-model="spuParams.tmId">
                <el-option v-for="item in allTradeMark" :key="item.id" :label="item.tmName" :value="item.id"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="SPU描述">
            <el-input type="textarea" placeholder="请您输入SPU描述" v-model="spuParams.description"></el-input>
        </el-form-item>
        <el-form-item label="SPU图片">
            <!-- 
                v-model:file-list->默认展示图片 
                action:上传图片的接口
                list-type:问价列表的类型
            -->
            <el-upload v-model:file-list="imgList" action="/api/admin/product/fileUpload" list-type="picture-card"
                :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="handlerUpload">
                <el-icon>
                    <Plus />
                </el-icon>
            </el-upload>
            <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%;" />
            </el-dialog>
        </el-form-item>
        <el-form-item label="SPU销售属性">
            <!-- 展示销售属性的菜单 -->
            <el-select v-model="saleAttrIdAndValueName"
                :placeholder="unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '无'">
                <el-option :value="`${item.id}:${item.name}`" v-for="item in unSelectSaleAttr" :key="item.id"
                    :label="item.name"></el-option>
            </el-select>
            <el-button @click="addSaleAttr" :disabled="saleAttrIdAndValueName ? false : true" style="margin-left: 10px"
                type="primary" icon="Plus">添加属性值</el-button>
            <!-- table展示销售属性与属性值的地方 -->
            <el-table border style="margin: 10px 0" :data="saleAttr">
                <el-table-column label="序号" type="index" width="80px" align="center"></el-table-column>
                <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
                <el-table-column label="销售属性值">
                    <!-- row：即为销售属性对象 -->
                    <template #="{ row }">
                        <el-tag style="margin: 0 10px" @close="row.spuSaleAttrValueList.splice(index, 1)"
                            v-for="(item, index) in row.spuSaleAttrValueList" :key="row.id" closable>
                            {{ (item as SaleAttrValue).saleAttrValueName }}
                        </el-tag>
                        <el-input v-if="row.flag == true" v-model="row.saleAttrValue" @blur="toLook(row)"
                            placeholder="请你输入属性值" size="small" style="width: 100px"></el-input>
                        <el-button v-else @click="toEdit(row)" type="primary" size="small" icon="Plus"></el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template #="{ $index }">
                        <el-button type="danger" icon="Delete" size="small" @click="saleAttr.splice($index, 1)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item>
            <el-button :disabled="saleAttr.length > 0 ? false : true" type="primary" @click="sale">保存</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { reqAllTradeMark, reqSpuImageList, reqSpuHasSaleAttr, reqAallSaleAttr, reqAddOrUpdateSpu } from '@/api/product/spu'
import type { SpuData, AllTradeMark, SpuHasImg, SaleAttrResponseData, HasSaleAttrResponseData, TradeMark, SpuImg, SaleAttr, HasSaleAttr, SaleAttrValue } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

// 存储已有的SPU这些数据
const allTradeMark = ref<TradeMark[]>([])
// 商品的图片
const imgList = ref<SpuImg[]>([])
// 已有的SPU销售属性
const saleAttr = ref<SaleAttr[]>([])
// 全部的销售属性
const allSaleAttr = ref<HasSaleAttr[]>([])
// 存储已有的SPU对象
const spuParams = ref<SpuData>({
    category3Id: '', // 三级分类ID
    description: '', // SPU描述
    spuName: '', // SPU名字
    tmId: '', // 品牌的id
    spuImageList: [],
    spuSaleAttrList: []
})
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 存储预览图片的地址
let dialogImageUrl = ref<string>()
// 将来收集还未选择的销售属性的ID与属性值的名字
let saleAttrIdAndValueName = ref<string>('')

const $emit = defineEmits(['changeScene'])

// 计算出当前SPU还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
    // 全部的销售属性：颜色、版本、尺码
    // 已有的销售属性：颜色、版本
    let unSelectArr = allSaleAttr.value.filter(item => {
        return saleAttr.value.every(item1 => {
            return item.name != item1.saleAttrName
        })
    })
    return unSelectArr
})

// 子组件点击取消按钮：通知父组件切换场景为1，展示现有的SPU的数据
const cancel = () => {
    $emit('changeScene', { flag: 0, params: 'update' })
}

// 子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
    // 存储已有的SPU对象，将来在模板中展示
    spuParams.value = spu
    // spu：即为父组件传递过来的已有SPU对象【不完整】
    // 先获取全部品牌数据
    const result: AllTradeMark = await reqAllTradeMark()
    // 获取某一个品牌旗下全部售卖商品的图片
    const result1: SpuHasImg = await reqSpuImageList(spu.id as number)
    // 获取已有的SPU销售属性的数据
    const reslult2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
    // 获取整个项目全部SPU的销售属性
    const result3: HasSaleAttrResponseData = await reqAallSaleAttr()

    // 存储全部品牌数据
    allTradeMark.value = result.data
    // SPU对应商品的图片
    imgList.value = result1.data.map(item => {
        return {
            name: item.imgName,
            url: item.imgUrl
        }
    })
    // 存储已有的SPU的销售属性
    saleAttr.value = reslult2.data
    // 存储全部的销售属性
    allSaleAttr.value = result3.data
}
// 照片墙点击预览的时候触发的钩子
const handlePictureCardPreview = (file: any) => {
    dialogImageUrl.value = file.url
    // 对话框弹出来
    dialogVisible.value = true
}
// 照片墙删除文件钩子
const handleRemove = () => {
    ElMessage({
        type: 'success',
        message: '删除成功'
    })
}
// 照片墙上传成功之前的钩子约束文件的大小与类型
const handlerUpload = (file: any) => {
    if (file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif') {
        if (file.size / 1024 / 1024 < 3) {
            return true
        } else {
            ElMessage({
                type: 'error',
                message: '上传的大小在3MB以内'
            })
        }
    } else {
        ElMessage({
            type: 'error',
            message: '提示的类型务必PGN|JPG|GIF'
        })
        return false
    }
}
// 添加销售属性的方法
const addSaleAttr = () => {
    /*
    baseSaleAttrId: number,
    saleAttrName: string,
    spuSaleAttrValueList: spuSaleAttrValueList
    */
    const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
    // 准备一个新的销售属性对象：将来带给服务器
    let newSaleAttr: SaleAttr = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
    }
    saleAttr.value.push(newSaleAttr)
    // 清空收集的数据
    saleAttrIdAndValueName.value = ''
}
// 属性值按钮点击事件
const toEdit = (row: SaleAttr) => {
    // 点击按钮的时候，input框就出现了=》编辑模式
    row.flag = true
    row.saleAttrValue = ''
}
// 表单元素失去焦点事件回调
const toLook = (row: SaleAttr) => {
    // 整理收集的属性的ID和属性值的名字
    const { baseSaleAttrId, saleAttrValue } = row
    // 整理成服务器需要的属性值形式
    let newSaleAttrValue: SaleAttrValue = {
        baseSaleAttrId,
        saleAttrValueName: saleAttrValue as string
    }
    // 非法情况判断
    if (saleAttrValue?.trim() == '') {
        ElMessage({
            type: 'error',
            message: '属性值不能为空'
        })
        return
    }
    // 判断属性值是否在数组当中存在
    let repeat = row.spuSaleAttrValueList.find(item => {
        return item.saleAttrValueName == saleAttrValue
    })
    if (repeat) {
        ElMessage({
            type: 'error',
            message: '属性值重复'
        })
        return
    }
    // 追加新的属性值对象
    row.spuSaleAttrValueList.push(newSaleAttrValue)
    // 切换为查看模式
    row.flag = false
}
// 保存按钮的回调
const sale = async () => {
    // 整理参数
    // 照片墙的数据
    spuParams.value.spuImageList = imgList.value.map((item: any) => {
        return {
            imgName: item.name, // 图片的名字
            imgUrl: (item.response && item.response.data) || item.url
        }
    })
    // 整理销售属性的数据
    spuParams.value.spuSaleAttrList = saleAttr.value
    // 发请求：添加SPU|更新已有的SPU
    const result = await reqAddOrUpdateSpu(spuParams.value)
    if (result.code == 200) {
        // 成功
        ElMessage({
            type: 'success',
            message: spuParams.value.id ? '更新成功' : '添加成功'
        })
        // 通知父组件切换场景为0
        $emit('changeScene', { flag: 0, params: spuParams.value.id ? 'update' : 'add' })
    } else {
        // 失败
        ElMessage({
            type: 'error',
            message: spuParams.value.id ? '更新失败' : '添加失败'
        })
    }
}
// 添加一个新的SPU初始化请求方法
const initAddSpu = async (c3Id: number | string) => {
    // 清空数据
    Object.assign(spuParams.value, {
        category3Id: '', // 三级分类ID
        description: '', // SPU描述
        spuName: '', // SPU名字
        tmId: '', // 品牌的id
        spuImageList: [],
        spuSaleAttrList: []
    })
    // 清空照片墙
    imgList.value = []
    saleAttr.value = []
    saleAttrIdAndValueName.value = ''
    // 存储三级分类Id
    spuParams.value.category3Id = c3Id
    // 先获取全部品牌数据
    const result: AllTradeMark = await reqAllTradeMark()
    // 获取整个项目全部SPU的销售属性
    const result1: HasSaleAttrResponseData = await reqAallSaleAttr()
    allTradeMark.value = result.data
    allSaleAttr.value = result1.data
}

defineExpose({ initHasSpuData, initAddSpu })

</script>

<style scoped></style>    