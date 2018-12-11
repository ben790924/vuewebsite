import Vue from 'vue'

Vue.prototype.$bus = new Vue()

//event bus 為跨元件都可以使用 如要避免找不到設定的方法 乾脆另外開一個bus.js