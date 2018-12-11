// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import router from './router'
import 'bootstrap'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/vue-loading.css'
import './bus'
import currencyFilter from './filter/currency'
import VeeValidate from 'vee-validate'
import zhTW from 'vee-validate/dist/locale/zh_TW'
Vue.filter('currency',currencyFilter)
Vue.component('Loading',Loading)
Vue.use(VueAxios,axios)
Vue.config.productionTip = false
axios.defaults.withCredentials=true
Vue.use(VeeValidate)
VeeValidate.Validator.localize('zh_TW',zhTW)
router.beforeEach((to,from,next)=>{
  if(to.meta.requiresAuth){
    const api = `${process.env.APIPATH}/api/user/check`
    axios.post(api).then((res)=>{
      if(res.data.success){
        next()
      }else{
        next({
          path:'/login'
        })
      }
    })
  }else{
    next()
  }
})

new Vue({
  el: '#app',
  axios,
  VueAxios,
  VueRouter,
  components: { App },
  template: '<App/>',
  router,
  
})
