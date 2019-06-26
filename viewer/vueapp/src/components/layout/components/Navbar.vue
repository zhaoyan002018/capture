<template>

  <b-navbar
    fixed="top"
    toggleable="md"
    class="Navbar"
    type="dark">

    <!--logo-->
    <b-navbar-brand v-if="showLogo">
      <router-link :to="{ name: 'dashboard' }">
        <div id="helpTooltipContainer" style="width: 144px; height: 36px;">
          <img :src="'/static/img/' + logo + '.png'"
              class="dps-logo"
              alt="hoot"
              id="tooltipHelp"
          />
        </div>
      </router-link>
      <b-tooltip :show="shiftKeyHold"
        triggers=""
        target="tooltipHelp"
        placement="leftbottom"
        container="helpTooltipContainer">
        <strong class="help-shortcut">H</strong>
      </b-tooltip>
    </b-navbar-brand>

    <!--<div style="position: absolute;left: 10px;top: 1px;">-->
    <div :class="isShowLogo">
      <!--toggle close-open-->
      <span style=" position: absolute;display: inline-block;line-height: 35px;" @click="toggleOpen()" :class="{ toggleOpen: isopened }">
      <svg-icon icon-class="toggleOpen"></svg-icon>
    </span>
      <!--breadcrumb-->
      <breadcrumb style="margin-left: 25px;line-height: 35px;" class="breadcrumb-container"/>
    </div>
    <!--screenfull-->
    <el-tooltip content="screenfull" placement="bottom">
      <screenfull class="screenfull right-menu-item"/>
    </el-tooltip>
    <!--用户按钮-->
    <el-dropdown @command="handleCommand"
                 style="position: absolute; right: 8px; top: 8px; cursor: pointer;" placement="bottom">
      <!--<el-tooltip content="用户信息" placement="bottom">-->
       <span>
         <svg-icon icon-class="users" name="users" class="users" style="width: 16px;height: 16px;"></svg-icon>
       </span>
      <!--</el-tooltip>-->
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command='/settings/index#password' style="white-space: nowrap;">修改密码</el-dropdown-item>
        <el-dropdown-item command='/logout' style="white-space: nowrap;">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <b-collapse is-nav
      id="nav_collapse">

      <b-navbar-nav
        class="ml-auto">
        <small class="navbar-text mr-2" style="margin-right: 22px!important;line-height: 36px;padding-top: 0!important;padding-bottom: 0!important;">
          {{ dpsVersion }}
        </small>
        <e-s-health></e-s-health>
      </b-navbar-nav>

    </b-collapse>
  </b-navbar>

</template>

<script>
// import qs from 'qs';
import Screenfull from '@/components/Screenfull';
import Breadcrumb from '@/components/Breadcrumb';
import ESHealth from '@/components/utils/ESHealth';

export default {
  name: 'MolochNavbar',
  components: { ESHealth, Screenfull, Breadcrumb },
  data: function () {
    return {
      dpsVersion: this.$constants.DPS_VERSION
      // logo: '../../../assets/' + this.$store.state.logo + '.*'
    };
  },
  computed: {
    shiftKeyHold: function () {
      return this.$store.state.shiftKeyHold;
    },
    isopened: function () {
      return this.$store.state.isOpened;
    },
    logo: {
      get: function () {
        return this.$store.state.logo;
      },
      set: function (newValue) {
        this.$store.commit('setLogo', newValue);
      }
    },
    showLogo: {
      get: function () {
        return this.$constants.DPS_SHOWLOGO;
      }
    },
    isShowLogo: function () {
      return {
        SHOWLOGO: this.showLogo,
        NOTLOGO: !this.showLogo
      };
    }
  },
  methods: {
    isActive: function (link) {
      return link === this.$route.path.split('/')[1];
    },
    logout: function () {
      this.$http.get('/logout').then(function () {
        window.location = '/logout';
      });
    },
    toggleOpen: function () {
      const MenuState = this.$store.state.menuState;
      if (MenuState) {
        this.$store.commit('setMenuState', false);
        this.$store.commit('setIsOpened', true);
      } else {
        this.$store.commit('setMenuState', true);
        this.$store.commit('setIsOpened', false);
      }
    },
    handleCommand (command) {
      if (command === '/logout') {
        this.logout();
      } else {
        this.$router.push({path: command});
      }
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

<style scoped>
  .SHOWLOGO{
    position: absolute;
    left: 156px;
    top: 1px;
  }
  .NOTLOGO{
    position: absolute;
    left: 10px;
    top: 1px;
  }
  .screenfull{
    position: absolute;
    right: 50px;
    top: 9px;
  }
.Navbar  .logout{
    position:absolute;
    width:24px;
    height:24px;
    right:5px;
    top:50%;
    margin-top:-12px;
    cursor: pointer;
  }
nav.navbar {
  z-index: 6;
  max-height: 36px;
  min-height: 36px;
}
.dps-logo {
  position: absolute;
  height: 32px;
  left: 8px;
  width: 120px;
  padding: 1px 0;
}
ul.navbar-nav {
  margin-left: 90px;
  margin-right:84px;
}
.breadcrumb-container {
  /*margin-left: 145px !important;*/
}
a.nav-link > a {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.5);
}
a.nav-link:hover > a {
  color: rgba(255, 255, 255, 0.75);
}
a.nav-link > a.router-link-active {
  color: #fff;
}

/* apply theme colors to navbar */
.navbar-dark {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-darker);
}

/* shortcut letter styles */
p { /* ::first-letter only works on blocks */
  margin-bottom: -16px;
  display: inline-block;
}
/* need this so that styled first letters don't expand the text */
p.shortcut-letter::first-letter {
  color: rgba(255, 255, 255, 0.5);
}
a.nav-link > a.router-link-active p.shortcut-letter::first-letter {
  color: #FFFFFF !important;
}
/* make sure hover still works */
.nav-link:hover p.shortcut-letter::first-letter {
  color: rgba(255, 255, 255, 0.75) !important;
}
/* style the sortcut letter */
p.shortcut-letter.holding-shift::first-letter {
  color: var(--color-tertiary-lighter) !important;
}
/* color the help shortcut letter in the tooltip */
.help-shortcut {
  color: var(--color-tertiary-lighter);
}
.toggleOpen{
  transform: rotateZ(90deg);
}
</style>
