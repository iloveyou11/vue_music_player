<template>
  <div class="music-list">
    <div
      class="back"
      @click="back"
    >
      <i class='icon-back'></i>
    </div>
    <h1
      class="title"
      v-html="title"
    ></h1>
    <div
      class="bg-image"
      :style='bgStyle'
      ref='bgImage'
    >
      <div class="play-wrapper">
        <div
          ref="playBtn"
          v-show='songs.length>0'
          class='play'
        >
          <i class="icon-play"></i>
          <span class='text'>随机播放全部</span>
        </div>
      </div>
      <div
        class="filter"
        ref='filter'
      ></div>
    </div>
    <div
      class="bg-layer"
      ref="layer"
    ></div>
    <scroll
      :data='songs'
      :listen-scroll='listenScroll'
      :probe-type='probeType'
      @scroll='scroll'
      ref='songList'
      class='list'
    >
      <div class="song-list-wrapper">
        <song-list
          :songs='songs'
          :rank='rank'
          @select="selectSong"
        ></song-list>
      </div>
      <div
        class="loading-container"
        v-show="!songs.length"
      >
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import Scroll from "../../base/scroll.vue";
import SongList from "../../base/song-list/song-list.vue";
import Loading from "../../base/loading/loading.vue";
import { prefixStyle } from "../../common/js/dom";
import { mapActions } from "vuex";
import { playlistMixin } from "../../common/js/mixin";
const leftHeigth = 40;
const transform = prefixStyle("transform");
const backdrop = prefixStyle("backdrop-filter");

export default {
  mixins: [playlistMixin],
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: function() {
        return [];
      }
    },
    title: {
      type: String,
      default: ""
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTransalteY = -this.imageHeight + leftHeigth;
    this.$refs.songList.$el.style.top = `${this.$refs.bgImage.clientHeight}px`;
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  methods: {
    handlePlaylist(playlist) {
      const bottomHeight = playlist.length > 0 ? "60px" : "";
      this.$refs.songList.$el.style.bottom = bottomHeight;
      this.$refs.songList.refresh();
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectSong(item, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    ...mapActions(["selectPlay"])
  },
  watch: {
    scrollY(newVal) {
      // 在这里监听 scroll的变化 并改变头部图片的值
      /*
         我们要达到两个效果 第一个效果：歌单列表向上滑动的时候 遮罩层随着向上（有一个向上的最大距离）
         往下滑的时候（图片要随着你下滑的距离 有一个放大的效果）
         */
      let zIndex = 0;
      let scale = 1;
      let blur = 0;
      let translateY = Math.max(this.minTransalteY, newVal);

      const percent = Math.abs(newVal / this.imageHeight);
      // 向下拉时，newVal>0，则image的高度要增加newVal
      // 下拉时图片跟随放大
      if (newVal > 0) {
        scale = 1 + percent;
        zIndex = 10;
      } else {
        blur = Math.min(20, percent * 20);
      }
      this.$refs.layer.style[transform] = `translate3d(0,${translateY}px,0)`;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;

      if (newVal < this.minTransalteY) {
        zIndex = 10;
        this.$refs.bgImage.style.height = `${leftHeigth}px`;
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.playBtn.style.display = "none";
      } else {
        this.$refs.bgImage.style.paddingTop = "70%";
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = "";
      }
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.bgImage.style.zIndex = zIndex;
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.music-list {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;

  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;

    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .title {
    position: absolute;
    top: 0;
    left: 10%;
    z-index: 40;
    width: 80%;
    no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }

  .bg-image {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 70%;
    transform-origin: top;
    background-size: cover;

    .play-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 50;
      width: 100%;

      .play {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;

        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }

        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }

    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }

  .bg-layer {
    position: relative;
    height: 100%;
    background: $color-background;
  }

  .list {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    background: $color-background;

    /* overflow:hidden */
    .song-list-wrapper {
      padding: 20px 30px;
    }

    .loading-container {
      position: absolute;
      width: 100%;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
