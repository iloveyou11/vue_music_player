<template>
  <div
    class="progress-bar"
    ref='progressBar'
    @click='progressBarClick'
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref='progress'
      ></div>
      <div
        class="progress-btn-wrapper"
        ref='progressBtn'
        @touchstart.prevent='touchStart'
        @touchmove.prevent='touchMove'
        @touchend='touchEnd'
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "common/js/dom";
const progressBtnWidth = 16;
const transform = prefixStyle("transform");

export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    // 不同回调函数之间共享数据
    this.touch = {};
  },
  methods: {
    offset(moveWidth) {
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${moveWidth}px,0,0)`;
      this.$refs.progress.style.width = `${moveWidth}px`;
    },
    touchStart(e) {
      this.touch.ininal = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth;
    },
    touchMove(e) {
      if (!this.touch.ininal) {
        return;
      }
      const deltax = e.touches[0].pageX - this.touch.startX;
      let movex = Math.max(0, this.touch.left + deltax);
      this.offset(movex);
    },
    touchEnd(e) {
      this.touch.ininal = false;
      this.triggerPercent();
    },
    triggerPercent() {
      const totalWidth = this.$refs.progressBar.clientWidth;
      const percent = this.$refs.progress.clientWidth / totalWidth;
      this.$emit("percentChange", percent);
    },
    progressBarClick(e) {
      var rect = this.$refs.progressBar.getBoundingClientRect();
      var moveWidth = e.pageX - rect.left;
      this.offset(moveWidth);
      this.triggerPercent();
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.ininal) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        // 偏移宽度
        const movewidth = newPercent * barWidth;
        // 黄色按钮图标 移动 进度条的宽度 加宽
        this.offset(movewidth);
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
