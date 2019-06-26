<template>
  <div>
    <!-- alert -->
    <el-alert v-if="message" :type="type" center show-icon :title="message || '未知消息'" @close="done(null)"
              :class="alertClass" style="height: 24px;">
      <!--&lt;!&ndash; dismiss alert button &ndash;&gt;-->
      <!--<el-button @click="done(null)" class="toast-button">-->
        <!--<span>&times;</span>-->
      <!--</el-button>&lt;!&ndash; /dismiss alert button &ndash;&gt;-->
    </el-alert>
  </div>
  <!-- alert -->
</template>

<script>
let timeout;

export default {
  name: 'MolochToast',
  props: {
    message: String,
    done: Function,
    duration: {
      type: Number,
      default: 5000
    },
    type: {
      type: String,
      default: 'info'
    }
  },
  watch: {
    message: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.dismissAfter();
      }
    }
  },
  computed: {
    alertClass: function () {
      return `alert-${this.type}`;
    }
  },
  created: function () {
    if (this.message) {
      this.dismissAfter();
    }
  },
  methods: {
    /* helper functions ------------------------------------------ */
    dismissAfter: function () {
      if (timeout) { clearTimeout(timeout); }

      timeout = setTimeout(() => {
        this.done();
      }, this.duration);
    }
  },
  beforeDestroy: function () {
    if (timeout) { clearTimeout(timeout); }
  }
};
</script>

<style scoped>
  .toast-button{
    position: absolute;width: 14px;height: 24px;padding: 0 8px;
    border: 0px;
    background-color: transparent;
    font-weight: 400;
    right: 14px;
    top: -1px;
    font-size: 25px;
    text-shadow: 0 1px 0 #fff;
  }
</style>
