<template>
<div v-if="!item.hidden">
  <!--if item has no children-->
  <template v-if="!item.children">
    <router-link :to="{name: item.name, query: itemQuery, params: {nav: true}}"
                 :key="item.name">
      <el-menu-item :index="item.name" :class="{'submenu-title-noDropdown':!isNest}">
        <p class="link_title">
          <item :icon="item.name" :title="item.title"></item>
        </p>
        <p style="position: absolute;right: 20px;font-size:12px;color: rgb(150, 162, 201);" v-if="isopened && shiftKey[item.name]">[shift+{{shiftKey[item.name]? shiftKey[item.name].key : ''}}]</p>
      </el-menu-item>
    </router-link>
  </template>
  <!--item has children-->
  <el-submenu v-else :index="item.name" ref="submenu">
    <template slot="title" class="hidden_svg">
      <item :icon="item.name" :title="item.title"></item>
    </template>
    <template v-for="child in item.children" >
      <div :key="child.name" v-if="!child.hidden">
        <sidebar-item
          v-if="child.children&&child.children.length>0"
          :is-nest="true"
          :item="child"
          :key="child.name"
          class="nest-menu">
        </sidebar-item>
      <!-- :base-path="resolvePath(child.path)"-->
        <router-link v-else :to="{name: child.name,query: itemQuery, prams: {nav: true} }"
                   :key="child.name">
        <el-menu-item :index="child.name">
          <p class="link_title" style="margin-left: 10px;">
            <item :icon="child.name" :title="child.title"></item>
          </p>
          <p style="float: right;color: rgb(150, 162, 201);font-size: 12px;" v-if="isopened && shiftKey[child.name]">[shift+{{shiftKey[child.name]? shiftKey[child.name].key : ''}}]</p>
        </el-menu-item>
      </router-link>
      </div>
    </template>
  </el-submenu>
</div>
</template>

<script>
import Item from './Item';

export default {
  name: 'SidebarItem',
  components: { Item },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      onlyOneChild: null,
      hasCommit: false
    };
  },
  computed: {
    routers: function () {
      return this.$router.options.routes;
    },
    itemQuery: function () {
      // return this.$store.state.query;// 从store中读取路由信息，store在页面刷新之后，会初始化
      return this.$route.query; // 从Vue的路由表中读取路由信息
    },
    user: function () {
      return this.$store.state.user;
    },
    shiftKey: function () {
      /* eslint-disable no-undef */
      return shortcutKey;
    },
    menuState: function () {
      return this.$store.state.menuState;
    },
    isopened: function () {
      return this.$store.state.isOpened;
    }
  },
  watch: {
    '$route.query': function (newVal, oldVal) {
      if (!this.hasCommit) {
        this.$store.commit('setQuery', newVal);
        this.hasCommit = true;
      }
    }
  },
  methods: {
  }
};
</script>
