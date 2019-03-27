import 'babel-polyfill'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import Vue from 'vue'
import App from './App'
import router from './router'
import './common/stylus/index.styl'
import store from './store'
// 解决300ms点击延迟问题
fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.use(VueLazyload, {
    loading: require('common/image/wangyi.png')
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    template: '<App/>'
})