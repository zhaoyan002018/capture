<template>
  <div class="register-page main">
   <div class="jumbotron">
    <h1>產品激活</h1>
    <br>
    <br>
    <h3>歡迎使用系統激活向導</h3>
    <br>
    <h3>请正确输入产品激活信息</h3>
    <br>
    <Input v-model="value" placeholder="输入序列号......" style="width: 600px;height:100px" />
    <div>
      <br>
      <RadioGroup  type="button">
        <div>
        <Radio label="apple">
          <Icon type="logo-apple"></Icon>
          <span>在线激活（推荐）</span>
        </Radio>
        </div>
        <div>
        <Radio label="android">
          <Icon type="logo-android"></Icon>
          <span>导入授权文件激活</span>
        </Radio>
        </div>
      </RadioGroup>
      <br>

      <button-group :size="buttonSize">
        <button :size="buttonSize" type="primary">
          <Icon type="ios-arrow-back" />
          后退
        </button>
        <button :size="buttonSize" type="primary">
          前进
          <Icon type="ios-arrow-forward" />
        </button>
      </button-group>
    </div>
   </div>
  </div>
</template>

<script>
  export default {
        name: 'Register',
        data: function () {
        return {
          value:'',
          refresh:10000
        }
    },
      computed: {
        username () {
          // 我们很快就会看到 `params` 是什么
          return this.$route.params.username
        }
      },
      methods: {
        goBack () {
          window.history.length > 1
            ? this.$router.go(-1)
            : this.$router.push('/')
        }
      }
    }
</script>

<style scoped>
.register-page.main {
  z-index: 4;
  position: fixed;
  margin:62px 5px 0px 10px;
  padding-left:10px;
  padding-top:20px;
  top: 10px;
  left: 140px;
  right: 0;
  background-color: #01b6ad;
  height:800px;
}
</style>
