<template>
    <!--<button-->
      <!--@click="handleClick"-->
      <!--:disabled="disabled"-->
      <!--:class="[ btn_default,type ? type : 'info' ]">-->
      <!--{{value}}-->
    <!--</button>-->
  <el-button
    :size="size"
    @click="handleClick"
    :icon="icon"
    :type="type"
    :title="value"
    :class="[ btn_default,type ? type : 'info' ]"
    :disabled="disabled">
    {{value}}
  </el-button>
</template>
<script>
export default {
  name: 'PubButton',
  data () {
    return {
      btn_default: 'btn_default'
    };
  },
  props: {
    // data
    value: String,
    // class
    type: {
      type: String,
      default: 'add'
    },
    disabled: Boolean,
    size: {
      type: String,
      default: 'mini'
    },
    icon: String
  },
  computed: {

  },
  methods: {
    handleClick: function (evt) {
      this.$emit('click', evt);
    }
  }
};
</script>

<style scoped>
  /*5种type对应的样式*/
  .refresh{
    background: #3a8ee6;
  }
  .add{
    background: #909399;
  }
  .del{
    background: #F56C6C;
  }
  .submit{
    background: #409EFF;
  }
  .cancel{
    background: #82848a;
  }
  .btn_default{
    /*padding: 5px 20px;*/
    font-size: 14px;
    font-weight: 900;
    /*display: inline-block;*/
    /*white-space: nowrap;*/
    /*cursor: pointer;*/
    /*border: 1px solid #DCDFE6;*/
    /*text-align: center;*/
    /*-webkit-box-sizing: border-box;*/
    /*-moz-box-sizing: border-box;*/
    /*box-sizing: border-box;*/
    margin: 0;
    color: #ffffff;
    /*border-radius: 7px;*/
    outline: none !important;
  }
</style>
