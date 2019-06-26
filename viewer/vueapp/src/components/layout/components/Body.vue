<template>
  <section class="app-main">
    <el-scrollbar :native="false" style="height: 100%;">
      <router-view v-if="user" />
      <transition name="shortcuts-slide">
        <moloch-keyboard-shortcuts
          v-if="displayKeyboardShortcutsHelp">
        </moloch-keyboard-shortcuts>
        <div v-else-if="shiftKeyHold && !displayKeyboardShortcutsHelp"
             class="shortcut-help">
        <span class="fa fa-question fa-fw">
        </span>
        </div>
      </transition>
    </el-scrollbar>
  </section>
</template>

<script>
// import MolochKeyboardShortcuts from './components/utils/KeyboardShortcuts';
export default {
  name: 'MolochBody',
  computed: {
    shiftKeyHold: {
      get: function () {
        return this.$store.state.shiftKeyHold;
      },
      set: function (newValue) {
        this.$store.commit('setShiftKeyHold', newValue);
      }
    },
    displayKeyboardShortcutsHelp: {
      get: function () {
        return this.$store.state.displayKeyboardShortcutsHelp;
      },
      set: function (newValue) {
        this.$store.commit('setDisplayKeyboardShortcutsHelp', newValue);
      }
    },
    user: {
      get: function () {
        return this.$store.state.user;
      },
      set: function (newValue) {
        this.$store.commit('setUser', newValue);
      }
    }
  }
};
</script>

<style scoped>
.app-main {
   height: calc(100vh - 62px);
   width: calc(100% - 36px);
   position: relative;
   top: 36px;
   left: 36px;
 }
</style>
