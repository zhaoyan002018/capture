<template>
<el-breadcrumb class="app-breadcrumb" separator="/">
  <transition-group name="breadcrumb">
    <el-breadcrumb-item v-for="(item, index) in levelList" v-if="item.meta.title" :key="item.path">
      <router-link v-if="index == 0" :class="dashboardCss" :to="{ path: item.path }">{{ generateTitle(item.meta.title)}}</router-link>
      <span v-else-if="index > 0 && index < levelList.length-1 " class="noRedirect">{{ generateTitle(item.meta.title) }}</span>
      <span v-else style="color:#fff">{{ generateTitle(item.meta.title) }}</span>
    </el-breadcrumb-item>
  </transition-group>
</el-breadcrumb>
</template>

<script>
import { generateTitle } from '@/components/utils/i18n';
// import pathToRegexp from 'path-to-regexp';

export default {
  data () {
    return {
      levelList: null,
      isOnlyDashboard: true,
      dashboardCss: {
        onlyOneChild: this.isOnlyDashboard,
        notOnlyChild: !this.isOnlyDashboard
      }
    };
  },
  watch: {
    $route () {
      this.getBreadcrumb();
    }
  },
  created () {
    this.getBreadcrumb();
  },
  computed: {
    base: function () {
      /* eslint-disable no-undef */
      return HomePage;
    }
  },
  methods: {
    generateTitle,
    // 获取路径信息
    getBreadcrumb () {
      let matched = this.$route.matched.filter(item => {
        if (item.name) {
          return true;
        }
      });
      const first = matched[0];
      if (first && first.name.trim().toLocaleLowerCase() !== this.base.name.toLocaleLowerCase()) {
        matched = [{ path: `/${this.base.name}`, meta: { title: `${this.base.title}` } }].concat(matched);
      }
      this.levelList = matched;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px;

  .noRedirect {
    color: #97a8be;
    cursor: text;
  }

  .onlyOneChild {
    color: #ffffff;
  }

  .notOnlyChild {
    color: #97a8be;
    cursor: pointer;
  }
}
</style>
