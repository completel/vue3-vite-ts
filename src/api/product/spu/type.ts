// 服务器全部接口返回的数据类型
export interface ResponseData {
    code: number,
    message: string,
    ok: boolean
}

// SPU数据的ts类型
export interface SpuData {
    id?: number,
    spuName: string,
    description: string,
    category3Id: string | number,
    tmId: number | string,
    spuSaleAttrList: null | SaleAttr[],
    spuImageList: null | SpuImg[]
}

// 数组：元素都是已有SPU数据类型
export type Records = SpuData[]

// 定义获取已有的SPU接口返回的数据TS类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number
    }
}

// 所有品牌数据的ts类型
export interface TradeMark {
    id: number,
    tmName: string,
    logUrl: string
}
// 品牌接口返回的数据类型
export interface AllTradeMark extends ResponseData {
    data: TradeMark[]
}

// 商品图片的ts类型
export interface SpuImg {
    id?: number,
    createTime?: string,
    updateTIme?: string,
    spuId?: number,
    imgName?: string,
    imgUrl?: string,
    name?: string,
    url?: string
}
// 已有的SPU的照片墙数据的类型
export interface SpuHasImg extends ResponseData {
    data: SpuImg[]
}

// 已有的销售的属性值对象ts类型
export interface SaleAttrValue {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null
}
// 存储已有的销售属性值数组类型
export type spuSaleAttrValueList = SaleAttrValue[]

// 销售属性对象ts类型
export interface SaleAttr {
    id?: number,
    createTime?: string,
    updateTime?: string,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList: spuSaleAttrValueList,
    flag?: boolean,
    saleAttrValue?: string
}
// SPU已有的销售属性接口返回的数据ts类型
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}

// 已有的全部SPU的返回数据类型ts类型
export interface HasSaleAttr {
    id: number,
    name: string
}

export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
}


export interface Attr {
    attrId: number | string, // 平台属性的ID
    valueId: number | string // 属性值ID
}
export interface aleAttr {
    saleAttrId: number | string, // 属性ID
    saleAttrValueId: number | string, // 属性值ID
    saleIdAndValueId?: string
}
export interface SkuData {
    category3Id: number | string, // 三级分类ID
    spuId: number | string, // 已有的SPU的ID
    tmId: number | string, // SKU品牌的ID
    skuName: string, // SKU名字
    price: number | string, // SKU价格
    weight: number | string, // SKU重量
    skuDes: string, // SKU描述
    skuAttrValueList?: Attr[], // 平台属性的收集
    skuSaleAttrValueList?: [],// 销售属性
    skuDefaultImg: string // SKU图片地址
}

// 获取SKU数据接口的ts类型
export interface SkuInfoData extends ResponseData {
    data: SkuData[]
}