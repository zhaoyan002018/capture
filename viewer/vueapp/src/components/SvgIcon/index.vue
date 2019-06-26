<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" />
  </svg>
</template>
<!--:xlink:href为xml语句，值为图标的url；-->
<!--aria-hidden设置为true，是避免屏幕拾取设备读取装饰作用的图标-->
<script>
export default {
  name: 'SvgIcon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String,
      default: ''
    }
  },
  computed: {
    iconName () {
      return `${this.baseUrl}#icon-${this.iconClass}`;
    },
    svgClass () {
      if (this.className) {
        return 'svg-icon ' + this.className;
      } else {
        return 'svg-icon';
      }
    },
    baseUrl () {
      return window.location.href;
    }
  }
};
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
