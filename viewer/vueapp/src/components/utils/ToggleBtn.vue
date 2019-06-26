<template>
  <div>
    <!--<a @click="toggle"-->
       <!--:class="btnClass"-->
       <!--class="btn btn-sm btn-toggle">-->
    <!--<span class="fa fa-close">-->
    <!--</span>-->
    <!--</a>-->
    <el-button @click="toggle" :class="btnClass">
    <span class="fa fa-close">
    </span>
    </el-button>
  </div>
</template>

<script>
export default {
  name: 'ToggleBtn',
  props: [ 'opened' ],
  computed: {
    btnClass: function () {
      return {
        'btn-toggle': this.opened,
        'collapsed': !this.opened
      };
    }
  },
  methods: {
    toggle: function () {
      this.$emit('toggle');
    }
  }
};
</script>

<style scoped>
/* override btn-sm style to better fit in table rows */
.btn-sm {
  padding: 3px 8px;
  font-size: 12px;
}

.btn-toggle,.collapsed{
  width:29px !important;
  height: 28px !important;
  padding: 2px;
}
/* transition for font awesome icon
 * only works for rotating icons 45 degrees  */
.btn-toggle .fa {
  -webkit-transform-origin: 50% 50%;
          transform-origin: 50% 50%;

  -webkit-transition: all 750ms;
          transition: all 750ms;
   -webkit-transform: rotate(0deg);
       -ms-transform: rotate(0deg);
           transform: rotateZ(0deg);
}
.collapsed .fa {
  -webkit-transform-origin: 50% 50%;
  transform-origin: 50% 50%;

  -webkit-transition: all 750ms;
  transition: all 750ms;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotateZ(45deg);
}
</style>
