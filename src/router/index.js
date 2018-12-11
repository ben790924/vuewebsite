import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
// import HelloWorld from '../components/HelloWorld';
import Login from '../components/pages/Login'
import Dashboard from '../components/Dashboard'
import Products from '../components/pages/Products'
import CustomerOrders from '../components/CustomerOrders'
import CustomerCheckout from '../components/pages/CustomerCheckout.vue'
export default new VueRouter({
    routes:[
        {
            path:'*',
            redirect:'/login'
        },
        // {
        //     path:'/',
        //     name:'HelloWorld',
        //     component:HelloWorld,
        //     meta: { requiresAuth: true }
        // },
        {
            path:'/login',
            name:'Login',
            component:Login,

        },
        {
            path:'/admin',
            name:'Dashboard',
            component:Dashboard,
            children:[
                {
                    path:'products',
                    name:'Products',
                    component:Products,
                    meta: { requiresAuth: true },
                },
            ]
        },
        {
            path:'/',
            name:'Dashboard',
            component:Dashboard,
            children:[
                {
                    path:'customer_orders',
                    name:'CustomerOrders',
                    component:CustomerOrders,

                },
                {
                    path:'customer_checkout/:orderId',
                    name:'CustomerCheckout',
                    component:CustomerCheckout,

                },
            ]
        },
    ]


})