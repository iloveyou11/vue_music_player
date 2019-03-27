import {
    playMode
} from 'common/js/config'
import {
    loadSearch,
    loadFavorite,
    loadPlay
} from 'common/js/cache'

const state = {
    singer: {},
    playing: false, //播放状态
    fullScreen: false, //是否全屏
    playlist: [], //播放列表
    sequenceList: [], //顺序列表
    mode: playMode.sequence, //播放模式
    currentIndex: -1, //当前播放索引
    disc: {},
    topList: {},
    searchHistory: loadSearch(),
    favoriteList: loadFavorite(),
    recentPlay: loadPlay()
}

export default state