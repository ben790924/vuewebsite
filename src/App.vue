<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

import HelloWorld from './components/HelloWorld'
import Login from './components/pages/Login'
export default {
  name: 'App',
  // components:{
  //   HelloWorld,
  //   Login
  // },
  created(){
    
  }
}
</script>

<style lang='scss'>
@import './assets/all.scss';
</style>
