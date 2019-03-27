import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 一级路由
const recommend = (resolve) => {
    import ('components/recommend/recommend.vue').then((module) => {
        resolve(module)
    })
}

const singer = (resolve) => {
    import ('components/singer/singer.vue').then((module) => {
        resolve(module)
    })
}

const rank = (resolve) => {
    import ('components/rank/rank.vue').then((module) => {
        resolve(module)
    })
}

const search = (resolve) => {
    import ('components/search/search.vue').then((module) => {
        resolve(module)
    })
}

// 二级路由
const singerDetail = (resolve) => {
    import ('../components/singer-detail/singer-detail.vue').then((module) => {
        resolve(module)
    })
}
const Disc = (resolve) => {
    import ('components/disc/disc').then((module) => {
        resolve(module)
    })
}
const topList = (resolve) => {
    import ('../components/top-list/toplist.vue').then((module) => {
        resolve(module)
    })
}
const userCenter = (resolve) => {
    import ('components/user-center/user-center').then((module) => {
        resolve(module)
    })
}

export default new Router({
    mode: 'history', //切换路径模式，变成history模式,不然路径为/#/home
    scrollBehavior: () => ({ // 滚动条滚动的行为，不加这个默认就会记忆原来滚动条的位置
        y: 0
    }),
    routes: [{
            path: '/',
            redirect: '/recommend'
        },
        {
            path: '/recommend',
            component: recommend,
            children: [{
                path: ':id',
                component: Disc
            }]
        },
        {
            path: '/singer',
            component: singer,
            children: [{
                path: ':id',
                component: singerDetail
            }]
        },
        {
            path: '/rank',
            component: rank,
            children: [{
                path: ':id',
                component: topList
            }]
        },
        {
            path: '/search',
            component: search
        }, {
            path: '/user',
            component: userCenter
        }
    ]
})