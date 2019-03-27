<template>
  <transition name='slide'>
    <div
      class="add-song"
      v-show='showFlag'
      @click.stop
    >
      <!-- 头部 -->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div
          class="close"
          @click="hide"
        >
          <i class="icon-close"></i>
        </div>
      </div>
      <!-- 搜索框 -->
      <div class="search-box-wrapper">
        <search-box
          ref='searchBox'
          @inputMsg='onInputMsg'
          placeholder="搜索歌曲"
        ></search-box>
      </div>
      <!-- 主体部分 -->
      <div
        class="shortcut"
        v-show="!searchMsg"
      >
        <switches
          :switches="switches"
          :currentIndex="currentIndex"
          @switch="switchItem"
        ></switches>
        <div class="list-wrapper">
          <!-- 最近播放列表 -->
          <scroll
            ref="songList"
            v-if="currentIndex===0"
            class="list-scroll"
            :data="recentPlay"
          >
            <div class="list-inner">
              <song-list
                :songs="recentPlay"
                @select="selectSong"
              >
              </song-list>
            </div>
          </scroll>
          <!-- 搜索历史列表 -->
          <scroll
            :refreshDelay="refreshDelay"
            ref="searchList"
            v-if="currentIndex===1"
            class="list-scroll"
            :data="searchHistory"
          >
            <div class="list-inner">
              <search-list
                :searches='searchHistory'
                @delete='deleteSearchHistory'
                @select='addMsg'
              ></search-list>
            </div>
          </scroll>
        </div>
      </div>

      <!-- 搜索列表 -->
      <div
        class="search-result"
        v-show='searchMsg'
      >
        <suggest
          @listScroll="blurInput"
          :searchMsg='searchMsg'
          ref='suggest'
        ></suggest>
      </div>

      <!-- 提示 -->
      <top-tip ref='topTip'>
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">歌曲{{AddSongName}}已经添加到播放列表</span>
        </div>
      </top-tip>

    </div>
  </transition>
</template>

<script>
import searchBox from "../../base/search-box.vue";
import Scroll from "../../base/scroll.vue";
import SongList from "../../base/song-list/song-list.vue";
import Switches from "../../base/switch.vue";
import { mapGetters, mapActions } from "vuex";
import SearchList from "../../base/search-list.vue";
import TopTip from "../../base/top-tip.vue";
import Suggest from "../../components/suggest/suggest.vue";
import Song from "../../common/js/song";
import { searchMixin } from "../../common/js/mixin";

export default {
  mixins: [searchMixin],
  components: {
    searchBox,
    Switches,
    Scroll,
    SearchList,
    SongList,
    Suggest,
    TopTip
  },
  data() {
    return {
      showFlag: false,
      searchMsg: "",
      currentIndex: 0,
      AddSongName: "",
      switches: [
        {
          name: "最近播放"
        },
        {
          name: "搜索历史"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["recentPlay"])
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    onInputMsg(searchMsg) {
      this.searchMsg = searchMsg;
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSong(song, index) {
      if (index != 0) {
        this.AddSongName = song.name;
        this.insertSong(new Song(song));
        this.$refs.topTip.show();
      }
    },
    ...mapActions(["insertSong"])
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.add-song {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background: $color-background;

  &.slide-enter-active, &.slide-leave-active {
    transition: all 0.3s;
  }

  &.slide-enter, &.slide-leave-to {
    transform: translate3d(100%, 0, 0);
  }

  .header {
    position: relative;
    height: 44px;
    text-align: center;

    .title {
      line-height: 44px;
      font-size: $font-size-large;
      color: $color-text;
    }

    .close {
      position: absolute;
      top: 0;
      right: 8px;

      .icon-close {
        display: block;
        padding: 12px;
        font-size: 20px;
        color: $color-theme;
      }
    }
  }

  .search-box-wrapper {
    margin: 20px;
  }

  .shortcut {
    .list-wrapper {
      position: absolute;
      top: 165px;
      bottom: 0;
      width: 100%;

      .list-scroll {
        height: 100%;
        overflow: hidden;

        .list-inner {
          padding: 20px 30px;
        }
      }
    }
  }

  .search-result {
    position: fixed;
    top: 124px;
    bottom: 0;
    width: 100%;
  }

  .tip-title {
    text-align: center;
    padding: 18px 0;
    font-size: 0;

    .icon-ok {
      font-size: $font-size-medium;
      color: $color-theme;
      margin-right: 4px;
    }

    .text {
      font-size: $font-size-medium;
      color: $color-text;
    }
  }
}
</style>
