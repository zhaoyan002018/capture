<template>
  <div :class="classObj">
    <el-scrollbar :native="false" wrap-class="scrollbar-wrapper" style="height: calc(100vh - 36px)" class="sidebar_container" >
      <el-menu
        :collapse="isCollapse"
        mode="vertical"
        class="el-menu-vertical-demo sidebar"
        background-color=var(--color-primary-dark)
        text-color="#fff"
        @mouseenter.native="open"
        @mouseleave.native="close">
        <sidebar-item v-for="route in routers" :key="route.name" :item="route" :base-path="route.name">
        </sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import SidebarItem from './SidebarItem';
export default {
  name: 'MolochSidebar',
  components: { SidebarItem },
  data: function () {
    return {
      collapse: true
    };
  },
  computed: {
    shiftKeyHold: function () {
      return this.$store.state.shiftKeyHold;
    },
    classObj: function () {
      return {
        hiddenSidebar: this.isCollapse,
        showSidebar: !this.isCollapse
        // sidebar_container: true
      };
    },
    routers: function () {
      /* eslint-disable no-undef */
      // constRouterMap 的值是从后端传过来的
      return constRouterMap;
    },
    isCollapse: function () {
      return this.$store.state.menuState && this.collapse;
    },
    MenuState: function () {
      return this.$store.state.menuState;
    }
  },
  methods: {
    isActive: function (link) {
      return link === this.$route.path.split('/')[1];
    },
    open: function () {
      this.$nextTick(() => {
        if (this.isCollapse) {
          this.collapse = false;
          this.$store.commit('setIsOpened', true);
        }
      });
    },
    close: function () {
      this.$nextTick(() => {
        if (!this.isCollapse && this.MenuState) {
          this.collapse = true;
          this.$store.commit('setIsOpened', false);
        }
      });
    }
  }
};
</script>

<style>
/* add an H tooltip by the owl but move it down a bit so
   that the links in the navbar are not covered up */
#helpTooltipContainer > div.tooltip {
  top: 16px !important;
}
/* move the arrow up to line up with the owl (since the
   tooltip was moved down) */
#helpTooltipContainer > div.tooltip > div.arrow {
  top: 2px !important;
}
/* make the tooltip smaller */
#helpTooltipContainer > div.tooltip > div.tooltip-inner {
  padding: 0 0.2rem !important;
}
</style>

<style lang="scss">
 @import '@/styles/sidebar.scss';
</style>
