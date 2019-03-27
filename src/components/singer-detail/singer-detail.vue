<template>
  <transition name='slide'>
    <music-list
      :title='title'
      :bg-image='bgImage'
      :songs='songs'
    >
    </music-list>
  </transition>

</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail, getMusic } from "api/singer";
import { resCode } from "api/config";
import { createSong } from "common/js/song";
import MusicList from "../../components/music-list/music-list.vue";

export default {
  data() {
    return {
      songs: []
    };
  },
  created() {
    this._getDetail();
  },
  computed: {
    ...mapGetters(["singer"]),
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    }
  },
  components: {
    MusicList
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail(this.singer.id).then(res => {
        if (res.code === resCode) {
          this.songs = this.normalizeSongs(res.data.list);
        }
      });
    },
    normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        // 对象的解构赋值 等同于 var musicData = item.musicData
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData));
        }
        // if (musicData.songid && musicData.albummid) {
        //   getMusic(musicData.songmid).then(res => {
        //     const svley = res.data.items;
        //     const songVkey = svley[0].vkey;
        //     ret.push(createSong(musicData, songVkey));
        //   });
        // }
      });
      return ret;
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
