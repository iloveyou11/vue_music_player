import { getLyric } from '../../api/song'
import { resCode } from '../../api/config'
import { commonParams } from '../../api/config'
import { Base64 } from 'js-base64'

export default class Song {
    constructor({ id, mid, singer, name, album, duration, image, url }) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }

    getLyrics() {
        // 获取歌词，并返回结果
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }
        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if (res.retcode === 0) {
                    // 使用Base64进行歌词解码
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                } else {
                    reject('no lyrics')
                }
            })
        })
    }
}

export function createSong(musicData, songVkey) {
    // songVkey取值不正确
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: `http://ws.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?vkey=${songVkey}&guid=468873248uin=2491&fromtag=66`
    })
}

function filterSinger(singer) {
    let ret = []
    singer.forEach((item) => {
        ret.push(item.name)
    })
    return ret.join('/')
}