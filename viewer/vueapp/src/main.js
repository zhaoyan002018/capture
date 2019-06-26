// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Vuex from 'vuex';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueMoment from 'vue-moment';
import moment from 'moment-timezone';
import VueClipboard from 'vue-clipboard2';
import BootstrapVue from 'bootstrap-vue/dist/bootstrap-vue.esm';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
// v-echarts
import VCharts from 'v-charts';
// vue-simple-uploader
import uploader from 'vue-simple-uploader';
// internal deps
import App from './App';
import MolochSessionField from './components/sessions/SessionField';
import HasPermission from './components/utils/HasPermission';
import interceptorSetup from './interceptors';
import router from './router';
import store from './store';
import zh from './i18n_zh.js';
import en from './i18n_en.js';
import './filters.js';
// bootstrap overrides
import './overrides.css';
// themed css deps
import './themes/default.css';
import './themes/blue.css';
import './themes/green.css';
import './themes/cotton-candy.css';
import './themes/dark-2.css';
import './themes/dark-3.css';
// import './permission'; // permission control
import '@/styles/index.scss'; // global css
import '@/icons';// icon

import './mock'; // simulation data
// element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import D2Crud from '@d2-projects/d2-crud';

import 'babel-polyfill';
// 后期自定义的全局组件
// import DpsTable from '@/components/dpsTable/index';
Vue.use(ElementUI);
Vue.use(D2Crud);
window.$ = window.jQuery = $;
Vue.config.productionTip = false;

Vue.use(VCharts);

Vue.use(VueI18n);
Vue.use(Vuex);
Vue.use(VueClipboard);
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.use(VueMoment, { moment });
Vue.use(uploader);

Vue.directive('has-permission', HasPermission);
Vue.component('moloch-session-field', MolochSessionField);
// Vue.component('dps-table', DpsTable);

interceptorSetup();

const i18n = new VueI18n({
  locale: 'zh',
  messages: {
    en,
    zh
  }
});

/* eslint-disable no-new */
window.App = new Vue({
  el: '#app',
  i18n,
  store,
  router,
  components: { App },
  template: '<App/>',

  created: function () {
    // define app constants
    /* eslint-disable no-undef */
    Vue.prototype.$constants = VENDOR_CONFIG;
  }
});
