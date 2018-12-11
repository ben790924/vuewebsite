<template>
    <div>
        <div class='row mt-4'>
                <loading :active.sync="isLoading"></loading>
            <div class="col-md-4 mb-4" v-for="item in products" :key="item.id">
                <div class="card border-0 shadow-sm">
                    <div style="height: 150px; background-size: cover; background-position: center"
                    :style='{backgroundImage : `url(${item.imageUrl})`}'>

                    </div>
                    <div class="card-body">
                    <span class="badge badge-secondary float-right ml-2">{{item.category}}</span>
                    <h5 class="card-title">
                        <a href="#" class="text-dark">{{item.title}}</a>
                    </h5>
                    <p class="card-text">{{item.content}}</p>
                    <div class="d-flex justify-content-between align-items-baseline">
                        <div class="h5" v-if="!item.price">{{item.origin_price}}</div>
                        <del class="h6" v-if="item.price">原價{{item.origin_price}}</del>
                        <div class="h5">現在只要 {{item.price}} 元</div>
                    </div>
                    </div>
                    <div class="card-footer d-flex">
                    <button type="button" class="btn btn-outline-secondary btn-sm" @click="getProduct(item.id)">
                        <i class="fas fa-spinner fa-spin" v-if="status.whichLoading ===item.id"></i>
                        查看更多
                    </button>
                    <button type="button" class="btn btn-outline-danger btn-sm ml-auto" @click="addToCart(item.id,product.num)">
                        <i class="fas fa-spinner fa-spin" v-if="status.whichLoading ===item.id"></i>
                        加到購物車
                    </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- 購物車內容 -->
<table class="table" :class="{'showTable':cart.length==0}">
    <thead>
        <th></th>
        <th>品名</th>
        <th>數量</th>
        <th>單價</th>
    </thead>
    <tbody>
        <tr v-for="item in cart" :key="item.id">
        <td class="align-middle">
            <button type="button" class="btn btn-outline-danger btn-sm" @click="deleteCart(item.id)">
            <i class="far fa-trash-alt"></i>
            </button>
        </td>
        <td class="align-middle">
            {{item.product.title}}
            <div class="text-success" v-if="item.coupon">
            已套用優惠券
            </div>
        </td>
        <td class="align-middle">{{ item.qty }}/{{ item.product.unit }}</td>
        <td class="align-middle text-right">{{ item.final_total }}</td>
        </tr>
    </tbody>
    <tfoot>
        <tr>
        <td colspan="3" class="text-right">總計</td>
        <td class="text-right">{{cartTotal.total}}</td>
        </tr>
        <tr v-if="cartTotal.total===!cartTotal.final_total">
        <td colspan="3" class="text-right text-success">折扣價</td>
        <td class="text-right text-success">{{cartTotal.final_total}}</td>
        </tr>
    </tfoot>
    </table>
    <div class="input-group mb-3 input-group-sm" :class="{'showTable':cart.length==0}">
    <input type="text" class="form-control" placeholder="請輸入優惠碼" v-model="coupon_code">
    <div class="input-group-append">
        <button class="btn btn-outline-secondary" type="button" @click="couPon">
        套用優惠碼
        </button>
    </div>

    </div>
    <div class="badge badge-danger">
    <span class="text-justify font-weight-bold text-xl-center p-5 m-0" v-if="coupon_message!==''">{{coupon_message}}</span>
    </div>
        <!-- 單一modal -->
        <div class="modal fade" id="productModal" tabindex="-1" role="dialog"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content border-0">
                <div class="modal-header bg-dark text-white">
                    <h5 class="modal-title" id="exampleModalLabel">
                    <span>{{product.title}}</span>
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="row">
                    <div class="col-sm-4">

                        <img img="https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=828346ed697837ce808cae68d3ddc3cf&auto=format&fit=crop&w=1350&q=80"
                        class="img-fluid" alt="" :src="product.imageUrl">
                    </div>
                    <div class="col-sm-8">

                        <div class="form-group">
                        <label for="description">產品描述</label>
                        <h3 class='text-center'>{{product.description}}</h3>
                        </div>
                        <div class="form-group align-items-end">
                        <span class="mb-10">說明內容</span> <br>
                        <span class="border-secondary text-primary p-2 rounded shadow" style="fontSize:33px">{{product.content}}</span>
                        <select name="" class="form-control mt-1" v-model="product.num">
                            <option :value="number" v-for="number in 10" :key="number">選購 {{number}} {{product.unit}}</option>
                        </select>
                        </div>
                    <span class="font-weight-bold text-primary w-5">金額為 {{product.num*product.origin_price}} 元</span>
                    </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-dismiss="modal" @click="canceladdtocart">取消</button>
                    <button type="button" class="btn btn-primary" @click="addToCart(product.id,product.num)">加到購物車</button>
                </div>
                </div>
            </div>
    </div>
        <!-- 建立訂單 輸入個人資料 -->
        <div class="my-5 row justify-content-center">
            <form class="col-md-6" @submit.prevent="order">
                <div class="form-group">
                <label for="useremail">Email</label>
                <input type="email" class="form-control" name="email" id="useremail"
                    v-model="form.user.email" placeholder="請輸入 Email"  v-validate="'required|email'" :class="{'is-invalid':errors.has('name')}">
                <span class="text-danger" v-if="errors.has('email')">{{ errors.first('email') }}</span>
                </div>

                <div class="form-group">
                <label for="username">收件人姓名</label>
                <input type="text" class="form-control" name="name" id="username"
                    v-model="form.user.name" placeholder="輸入姓名" v-validate="'required'" :class="{'is-invalid':errors.has('name')}">
                <span class="text-danger" v-if="errors.has('name')">必須輸入姓名</span>
                </div>

                <div class="form-group">
                <label for="usertel">收件人電話</label>
                <input type="tel" class="form-control" name="tel" id="usertel" v-model="form.user.tel" placeholder="請輸入電話" v-validate="'required'" :class="{'is-invalid':errors.has('tel')}">
                <span class="text-danger" v-if="errors.has('tel')">需要寫上電話號碼</span>
                </div>

                <div class="form-group">
                <label for="useraddress">收件人地址</label>
                <input type="address" class="form-control" name="address" id="useraddress" v-model="form.user.address"
                    placeholder="請輸入地址" v-validate="'required'" :class="{'is-invalid':errors.has('address')}">
                <span class="text-danger" v-if="errors.has('address')">地址欄位不得留空</span>
                </div>

                <div class="form-group">
                <label for="useraddress">留言</label>
                <textarea name="" id="" class="form-control" cols="30" rows="10" v-model="form.message"></textarea>
                </div>
                <div class="text-right">
                <button class="btn btn-danger">送出訂單</button>
                </div>
            </form>
        </div>
    </div>
</template>
<script>
import $ from 'jquery'
export default {
    data(){
        return{
            products:[],
            isLoading:false,
            product:{},
            status:{
                whichLoading:'',
                shoppingLoading:''
            },
            cart:{},
            // isCartOrdered:{},
            all:0,
            coupon_code:'',
            coupon_message:'',
            temp:0,
            cartTotal:{},
            form:{
                user:{
                    name:'',
                    email:'',
                    tel:'',
                    address:'',
                },
                message:''
            }
        }
    },
    methods:{
        getProducts(){
            let vm = this
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/products`
            vm.isLoading=true
            this.$http.get(api).then((res)=>{
                // console.log('products',res.data)
                vm.products = res.data.products
                vm.isLoading=false
            })
        },
        getProduct(id){
            let vm = this
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/product/${id}`
            vm.status.whichLoading=id

            this.$http.get(api).then((res)=>{
                // console.log('product',res.data)
                vm.product = res.data.product
                $('#productModal').modal('show')
                vm.status.whichLoading=''

            })

    },
        addToCart(id,qty = 1){
            let vm = this
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
            vm.status.whichLoading=id
            const cart={
                product_id:id,
                qty
            }
            this.$http.post(api,{data:cart}).then((res)=>{
                console.log('addToCart',res)
                // vm.isCartOrdered = cart.qty
                // console.log('isCartOrdered',vm.isCartOrdered)
                vm.status.whichLoading=''
                vm.getCart()
                $('#productModal').modal('hide')

        })
    },
    canceladdtocart(){
        $('#productModal').modal('hide')
    },
    getCart(){
        let vm = this
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart`
            vm.isLoading=true
            this.$http.get(api).then((res)=>{
                // console.log('products',res.data)
                console.log('getCart',res)
                vm.cart = res.data.data.carts
                vm.cartTotal = res.data.data
                // console.log('cart',vm.cart)
                vm.isLoading=false
            })
    },
    deleteCart(id){
        let vm = this
            let api =`${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/cart/${id}`
            vm.isLoading=true
            vm.axios.delete(api).then((res)=>{
                vm.getCart()
                vm.isLoading=false
            })
    },
    couPon(){
        let vm = this
            let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/coupon`
            vm.isLoading=true
            let coupon = {code:vm.coupon_code}
            this.$http.post(api,{data:coupon}).then((res)=>{
                console.log('coupon',res)

                if(res.success){
                    vm.coupon_message=res.data.message
                }else{
                    vm.coupon_message=res.data.message
                }
                vm.isLoading=false
            })
    },
    order(){
        let vm = this
        let api = `${process.env.APIPATH}/api/${process.env.CUSTOMPATH}/order`
        // vm.isLoading=true
        let userOrder = vm.form
            this.$validator.validate().then((result) => {
                if (result) {
                this.$http.post(api,{data:userOrder}).then((res)=>{
                console.log('order',res)
                if(res.data.success){
                    vm.$router.push(`/customer_checkout/${res.data.orderId}`)
                }
                vm.isLoading=false
        })
                }else{
                    console.log('資料不完整')
                }
            })
    }


},
computed:{
    carttotalPrice(){

        return this.temp+=this.cart.final_total
        this.getProducts()
    }
},
created(){
        this.getProducts()
        this.getCart()
        // this.carttotalPrice()

    },
mounted(){
    console.log('cart',this.cart)
},
}
</script>
