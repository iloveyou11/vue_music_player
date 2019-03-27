<template>
  <div
    class="singer"
    ref="singer"
  >
    <listview
      :data="singers"
      ref="list"
      @select='selectSinger'
    ></listview>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "api/singer";
import { resCode } from "api/config";
import Singer from "common/js/singer";
import Listview from "base/listview";
import { playlistMixin } from "common/js/mixin";
import { mapMutations } from "vuex";

const hotName = "热门";
const hotLength = 10;

export default {
        mixins: [playlistMixin],
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  components: {
    Listview
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    selectSinger(item) {
      this.$router.push({
        path: `/singer/${item.id}`
      });
      this.setSinger(item);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === resCode) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    // 将原始数据格式变为按照字符分组的二级数组
    _normalizeSinger(list) {
      let map = {
        hot: {
          title: hotName,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < hotLength) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            })
          );
        }
        const key = item.Findex;
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          })
        );
      });
      // 根据FIndex，即key值进行排序
      let charArr = [],
        hotArr = [];
      for (let k in map) {
        if (map[k].title.match(/[a-zA-Z]/)) {
          charArr.push(map[k]);
        } else if (map[k].title === hotName) {
          hotArr.push(map[k]);
        }
      }
      charArr.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hotArr.concat(charArr);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
