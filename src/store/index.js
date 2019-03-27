/**
 * Created by majunchang on 2017/7/31.
 */
//  引入相关插件
import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutation'
// 查看每次store的变化
// import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)
    // 在开发环境下开启debug模式
const debug = process.env.NODE_ENV !== 'production';

// 在这里 就不再使用调试工具debug了

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    // strict:debug,
    // plugins: debug ? [createLogger()] : []
})