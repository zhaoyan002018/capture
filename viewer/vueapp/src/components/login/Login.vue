<template>
  <div>
    <div class="content" id="login">
      <form>
        <div class="header">
          {{this.$constants.DPS_TITLE_CONFIG}}
        </div>
        <input type="text" class="form-control" id="inputAcount" placeholder="请输入账号" v-model="username" @keyup.enter="nextInput()" />
        <div style="position: relative;">
          <input :type="passwordType" class="form-control" id="inputPassword" placeholder="请输入密码" v-model="password" @keyup.enter="likeTab()" />
          <span @click.stop="changePswType(passwordType)">
            <svg-icon icon-class="eye" class="eye" style="position: absolute;top: 11px;right: 22px;cursor: pointer;"></svg-icon>
          </span>
        </div>
        <input type="text" placeholder="请输入验证码" class="form-control inputImageCode" v-model="captcha" id="inputImageCode" @keyup.enter="Login" />
        <span class="form-control  imageCode" @click.stop="refreshImageCode"></span>
        <br />
        <input type="button" value="登录" class="button" @click="Login" />
      </form>
    </div>
    <footer>
      <p>{{this.$constants.DPS_COMPANY}}</p>
      <!--<p>深信服科技有限公司</p>-->
      <!--<a href="http://www.sangfor.com.cn/" target="_blank">http://www.sangfor.com.cn/</a>-->
      <!--<a :href="'http://'+this.$constants.DPS_WEBSITE" target="_blank">{{this.$constants.DPS_WEBSITE}}</a>-->
      <p style="text-align: center;">
        <a v-if="this.$constants.DPS_WEBSITE.indexOf('http') !== -1" :href="this.$constants.DPS_WEBSITE" target="_blank">{{this.$constants.DPS_WEBSITE}}</a>
        <a v-else :href="'http://'+this.$constants.DPS_WEBSITE" target="_blank">{{this.$constants.DPS_WEBSITE}}</a>
      </p>
    </footer>
  </div>
</template>

<script>
import axios from 'axios';
import md5 from 'js-md5';
import { showPassword } from '@/api/validate';

export default {
  name: 'Login',
  data: function () {
    return {
      passwordType: 'password',
      username: '',
      password: '',
      remember: '',
      captcha: '',
      imageCode: ''
    };
  },
  beforeMount () {
    this.getImageCode();
  },
  computed: {
    homePage: function () {
      /* eslint-disable no-undef */
      return HomePage;
    }
  },
  methods: {
    Login () {
      axios.post('/login', {
        params: {
          username: this.username,
          password: md5(this.password),
          captcha: this.captcha
        }
      })
        .then(this.LoginSucc)
        .catch((err) => {
          this.LoginFail(err);
        }).then(this.getImageCode);
    },
    LoginSucc (res) {
      let data = res.data;
      if (data.success) {
        window.location = this.homePage.name;
      } else {
        this.$notify({
          title: '错误',
          message: data.message,
          type: 'success',
          duration: 2000
        });
      }
    },
    LoginFail (res) {
      this.$notify({
        title: '错误',
        message: '登录错误',
        type: 'success',
        duration: 2000
      });
    },
    md5 (str, encoding) {
      return crypto
        .createHash('md5')
        .update(str)
        .digest(encoding || 'hex');
    },
    getImageCode () {
      const that = this;
      $('.imageCode').eq(0).html('');
      axios.get('/getcaptcha').then(function (res) {
        that.imageCode = res.data.img;
        $('.imageCode').eq(0).append(that.imageCode);
        $('span.form-control.imageCode svg').css({ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 });
      });
    },
    refreshImageCode () {
      $('.imageCode').empty();
      this.getImageCode();
    },
    likeTab () {
      $('#inputImageCode').focus();
    },
    nextInput () {
      $('#inputPassword').focus();
    },
    changePswType (passwordType) {
      let that = this;
      showPassword(passwordType, 'passwordType', that);
    }
  }
};
</script>

<style scoped>
  @media screen and (max-width: 1024px) {
    .header {
      font-size: 25px !important;
    }

    footer p, footer a {
      margin: 0;
      font-size: 25px !important;
    }
  }

  @media screen and (max-width: 768px) {
    .header {
      font-size: 28px !important;
    }

    footer p, footer a {
      margin: 0;
      font-size: 21px !important;
    }
  }

  @media screen and (max-width: 480px) {
    .header {
      font-size: 20px !important;
    }

    footer p, footer a {
      margin: 0;
      font-size: 15px !important;
    }
  }

  #login {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("../../assets/bg-1.png") center no-repeat;
    background-size: 100% 100%;
    padding: 0;
    top: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #login img {
    margin-top: 40px;
  }

  .content {
    position: relative;
    height: 50%;
  }

  .inputImageCode {
    width: 60%;
    float: left;
  }
  .imageCode {
    width: 36%;
    display: inline-block;
    margin-bottom: 20px;
    position: relative;
    background: url(../../assets/bg_imageCode.jpg) no-repeat center center;
    border: transparent;
  }
  form {
    box-shadow: 0 20px 38px rgba(8, 49, 101, 0.4);
    font-family: "Microsoft YaHei" !important;
    text-align: center;
    color: #fff;
    font-weight: 300;
    padding:0 20px;
    width: 349px;
    height: 320px;
  }

  .form-control::-webkit-input-placeholder {
    color: #999;
    font-family: "Microsoft YaHei" !important;
  }

  /* 使用webkit内核的浏览器 */
  .form-control::-moz-placeholder {
    color: #999;
    font-family: "Microsoft YaHei" !important;
  }

  /* Firefox版本19+ */
  .form-control:-ms-input-placeholder {
    color: #999;
    font-family: "Microsoft YaHei" !important;
  }

  /* IE浏览器 */

  .header {
    font-size: 25px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  input {
    margin-bottom: 20px;
    border-radius: 15px;
    color: #333;
    /*height: 40px;*/
    border:1px solid #ced4da;
    outline: none;
  }

  .button {
    height:38px !important;
    margin-top: 20px;
    width:100%;
    background: #5CACEE;
    color: #ffffff;
    border: transparent;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    font-family: "Microsoft YaHei" !important;
  }

  .nav-link {
    color: #fff;
    padding: 0;
  }

  button {
    background: #459dc6;
    color: #fff;
    margin-top: 20px;
    margin-bottom: 20px;
    border-radius: 15px;
    font-family: "Microsoft YaHei" !important;
  }

  footer {
    position: fixed;
    padding: 0;
    bottom: 50px;
    /*margin-bottom: 50px;*/
    color: #fff;
    /*left: 50%;*/
    /*margin-left: -7%;*/
    width: 100%;
    text-align: center;
  }

  footer p {
    margin: 0;
    font-size: 20px;
  }

  footer a {
    color: #fff;
  }
</style>
