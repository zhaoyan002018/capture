// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Login from './components/login/Login';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/icons';// icon
import 'babel-polyfill';
Vue.config.productionTip = false;
Vue.use(ElementUI);
/* eslint-disable no-new */
new Vue({
  el: '#entry',
  components: {Login},
  template: '<Login/>',
  created: function () {
    // define app constants
    /* eslint-disable no-undef */
    Vue.prototype.$constants = VENDOR_CONFIG;
  }
});
