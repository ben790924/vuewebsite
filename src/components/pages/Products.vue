<template>
    <div>
        <div class="vld-parent">
            <loading :active.sync="isLoading"></loading>
        </div>
        <div class="text-right mt-4">
            <button class="btn btn-lg btn-primary" @click='showModal(true)'>建立新的產品</button>
        </div>
        <table class="table mt-4">
            <thead>
                <tr>
                    <th width='50'>分類</th>
                    <th width='180'>產品名稱</th>
                    <th width='30'>原價</th>
                    <th width='30'>售價</th>
                    <th width='80'>是否啟用</th>
                    <th width='50'>編輯</th>
                    <th width='50'>刪除</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in products" :key='item.id'>
                    <td>{{item.category}}</td>
                    <td>{{item.title}}</td>
                    <td class="text-right">{{item.origin_price | currency}}</td>
                    <td class="text-right">{{item.price | currency}}</td>
                    <td>
                        <span class="text-success" v-if="item.is_enable">啟用</span>
                        <span v-else>未啟用</span>
                    </td>
                    <td><button class="btn btn-outline-primary btn-sm" @click='showModal(false,item)'>編輯</button></td>
                    <td><button class="btn btn-outline-danger btn-sm" @click="deleteList(item.id)">刪除</button></td>
                </tr>
            </tbody>
        </table>
        <!-- Pagination -->
        <!-- <nav aria-label="Page navigation example">
            <ul class="pagination">
                <li class="page-item" :class='{"disable":!pagination.has_pre}'>
                <a class="page-link" href="#" aria-label="Previous" @click.prevent='getProducts(pagination.current_page - 1)'>
                    <span aria-hidden="true">&laquo;</span>
                    <span class="sr-only">Previous</span>
                </a>
                </li>
                <li v-for='(page,key) in pagination.total_pages' class="page-item" :key='key' :class='{"active":pagination.current_page===page}' @click.prevent='getProducts(page)'><a class="page-link" href="#">{{page}}</a></li>
                <li class="page-item" :class='{"disable":!pagination.has_next}'>
                <a class="page-link" href="#" aria-label="Next" @click.prevent='getProducts(pagination.current_page + 1)'>
                    <span aria-hidden="true">&raquo;</span>
                    <span class="sr-only">Next</span>
                </a>
                </li>
            </ul>
        </nav> -->

        <!-- Pagination component -->
        <Pagination @bridgepagination='getProducts' :childpagination='pagination'></Pagination>
        <!-- Modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
            <span>新增產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            <div class="row">
            <div class="col-sm-4">
                <div class="form-group">
                <label for="image">輸入圖片網址</label>
                <input type="text" class="form-control" id="image" v-model="tempProduct.imageUrl"
                    placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                <label for="customFile">或 上傳圖片
                    <i class="fas fa-spinner fa-pulse" v-if="this.loadingStatus.iconLoading"></i>
                </label>
                <input type="file" id="customFile" class="form-control"
                    ref="files" @change='uploadFile'>
                </div>
                <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                class="img-fluid" alt="" :src="tempProduct.imageUrl">
            </div> 
            <div class="col-sm-8">
                <div class="form-group">
                <label for="title">標題</label>
                <input type="text" class="form-control" id="title" v-model="tempProduct.title"
                    placeholder="請輸入標題">
                </div>

                <div class="form-row">
                <div class="form-group col-md-6">
                    <label for="category">分類</label>
                    <input type="text" class="form-control" id="category"
                    placeholder="請輸入分類"  v-model="tempProduct.category">
                </div>
                <div class="form-group col-md-6">
                    <label for="price">單位</label>
                    <input type="unit" class="form-control" id="unit"
                    placeholder="請輸入單位"  v-model="tempProduct.unit">
                </div>
                </div>

                <div class="form-row">
                <div class="form-group col-md-6">
                <label for="origin_price">原價</label>
                    <input type="number" class="form-control" id="origin_price"
                    placeholder="請輸入原價"  v-model="tempProduct.origin_price">
                </div>
                <div class="form-group col-md-6">
                    <label for="price">售價</label>
                    <input type="number" class="form-control" id="price"
                    placeholder="請輸入售價"  v-model="tempProduct.price">
                </div>
                </div>
                <hr>

                <div class="form-group">
                <label for="description">產品描述</label>
                <textarea type="text" class="form-control" id="description"
                    placeholder="請輸入產品描述"  v-model="tempProduct.description"></textarea>
                </div>
                <div class="form-group">
                <label for="content">說明內容</label>
                <textarea type="text" class="form-control" id="content"
                    placeholder="請輸入產品說明內容" v-model="tempProduct.content"></textarea>
                </div>
                <div class="form-group">
                <div class="form-check">
                    <input class="form-check-input" type="checkbox"
                    id="is_enabled"  v-model="tempProduct.is_enable" :true-value='1' :false-value='0'>
                    <label class="form-check-label" for="is_enabled">
                    是否啟用
                    </label>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-primary" @click='updateProduct'>確認</button>
        </div>
        </div>
    </div>
    </div>


    <div class="modal fade" id="delProductModal" tabindex="-1" role="dialog"
    aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
        <div class="modal-content border-0">
        <div class="modal-header bg-danger text-white">
            <h5 class="modal-title" id="exampleModalLabel">
            <span>刪除產品</span>
            </h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <div class="modal-body">
            是否刪除 <strong class="text-danger">{{ tempProduct.title }}</strong> 商品(刪除後將無法恢復)。
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary" data-dismiss="modal">取消</button>
            <button type="button" class="btn btn-danger"
            >確認刪除</button>
        </div>
        </div>
    </div>
    </div>
    </div>
</template>

<script>
import Pagination from '../Pagination';

import $ from 'jquery'
export default {
    components:{
        Pagination
    },
    data(){
        return{
            products:[],
            tempProduct:{},
            pagination:{},
            isNew:false,
            isLoading:false,
            loadingStatus:{
                iconLoading:false
            }
        }
    },
    methods:{
        getProducts(page=1){
            const api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/products?page=${page}`
            var vm = this
            vm.isLoading=true
            this.axios.get(api).then((res)=>{
                // console.log(res.data)
                vm.products=res.data.products
                vm.isLoading=false
                vm.pagination = res.data.pagination
                // console.log(vm.pagination)
    })
        },
        showModal(isNew,item){
            if(isNew){
                this.tempProduct = {}
                this.isNew = true
            }else{
                this.tempProduct = {...item}
                this.isNew = false
            }
            $('#productModal').modal('show')
        },
        deleteList(id){
            let vm = this
            let api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${id}`
            vm.axios.delete(api).then((res)=>{
                // console.log(res)
                this.products.map((item,idx)=>{
                    console.log('item:',item,'idx:',idx,'vm.products:',vm.products)
                    vm.products.splice(idx,1)
                    vm.getProducts()
                    return vm.products
                })
                // console.log(res,'id',id,'order',order)
                // if(res.data.success){
                //     vm.products.splice(id,1)
                // }
            })
        },
        updateProduct(){
            const vm = this
            let api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product`
            let httpMethod = 'post'
            if(!vm.isNew){
                api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/product/${vm.tempProduct.id}`
                httpMethod = 'put'
            }
            this.$http[httpMethod](api,{data:vm.tempProduct}).then((res)=>{
                if(res.data.success){
                $('#productModal').modal('hide')
                vm.getProducts()
                }else{
                $('#productModal').modal('hide')
                vm.getProducts()
                console.log('新增失敗')
                }
            })
        },
        uploadFile(){
            const vm = this
            const uploadedFile = this.$refs.files.files[0]
            const formData = new FormData()
            vm.loadingStatus.iconLoading=true
            formData.append('file-to-upload',uploadedFile)  /* formData.append(name,value) */
            const url = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/admin/upload`
            this.$http.post(url,formData,{  /* $.post(URL,data,callback) url必須,data可選 發送的數據,callback可選 請求成功後所執行的*/
                headers:{ /* 更改enctype固定方法 */
                    'Content-type':'multipart/form-data'
                }
            }).then((res)=>{
                // this.tempProduct.imageUrl = res.data.imageUrl
                // console.log( this.tempProduct)
                //imageUrl沒有getter setter 要用$set()強制寫入
                if(vm.tempProduct.success){
                vm.$set(this.tempProduct,'imageUrl',res.data.imageUrl) /* $set(需更改內容的"物件",更改"物件"的key,更改"物件"的value) */
                vm.loadingStatus.iconLoading=false
                }else{
                    this.$bus.$emit('message:push',res.data.message,'danger')
                }
            })
        },
    },
    created(){
        this.getProducts()

    },
}


</script>

