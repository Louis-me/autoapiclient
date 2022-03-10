import Vue from 'vue'
import App from './App.vue'
import router from './router'
// 引用element-ui的设置
import './plugins/element.js'
// 引用element-ui的css
import 'element-ui/lib/theme-chalk/index.css';
// 引用axios请求的设置
import './plugins/axios.js'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
