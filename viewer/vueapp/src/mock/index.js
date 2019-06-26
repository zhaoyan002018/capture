import Mock from 'mockjs';
import loginAPI from './login';
import interfaceAPI from './article';
import routingAPI from './routing';
import linkingAPI from './linking';
import dashboardAPI from './dashboard';
import remoteSearchAPI from './remoteSearch';
import transactionAPI from './transaction';
import platRunStateAPI from './platRunState';
import strategyAPI from './strategy';
import ruleBaseAPI from './ruleBase';
import userIpAPI from './userIp';
import editEventLevelAPI from './editEventLevel';
import collectStrategyAPI from './collectStrategy';
import testAPI from './test';

// 修复在使用 MockJS 情况下，设置 withCredentials = true，且未被拦截的跨域请求丢失 Cookies 的问题
// https://github.com/nuysoft/Mock/issues/300
Mock.XHR.prototype.proxy_send = Mock.XHR.prototype.send;
Mock.XHR.prototype.send = function () {
  if (this.custom.xhr) {
    this.custom.xhr.withCredentials = this.withCredentials || false;
  }
  this.proxy_send(...arguments);
};

// Mock.setup({
//   timeout: '350-600'
// })

// 登录相关
Mock.mock(/\/login\/login/, 'post', loginAPI.loginByUsername);
Mock.mock(/\/login\/logout/, 'post', loginAPI.logout);
Mock.mock(/\/user\/info\.*/, 'get', loginAPI.getUserInfo);

// 接口配置相关
Mock.mock(/\/interface\/list/, 'get', interfaceAPI.getList);
Mock.mock(/\/interface\/toggle/, 'post', interfaceAPI.togleState);
Mock.mock(/\/interface\/create/, 'post', interfaceAPI.createArticle);
Mock.mock(/\/interface\/update/, 'post', interfaceAPI.updateArticle);

// 路由配置相关
Mock.mock(/\/routing\/list/, 'get', routingAPI.getList);
Mock.mock(/\/routing\/update/, 'post', routingAPI.updateArticle);
Mock.mock(/\/routing\/delete/, 'post', routingAPI.deleteRoute);
Mock.mock(/\/routing\/create/, 'post', routingAPI.createArticle);

// 链路配置相关
Mock.mock(/\/linking\/list/, 'get', linkingAPI.getList);
Mock.mock(/\/linking\/update/, 'post', linkingAPI.updateArticle);
Mock.mock(/\/linking\/edit/, 'post', linkingAPI.editArticle);
Mock.mock(/\/linking\/delete/, 'post', linkingAPI.deleteRoute);
Mock.mock(/\/linking\/create/, 'post', linkingAPI.createArticle);

// 搜索相关
Mock.mock(/\/search\/user/, 'get', remoteSearchAPI.searchUser);

// 账单相关
Mock.mock(/\/transaction\/list/, 'get', transactionAPI.getList);

// 首页数据
Mock.mock(/\/dashboard\/list/, 'get', dashboardAPI.getList);

// 攻击事件页面处理
Mock.mock(/\/disposeEvent/, 'post', dashboardAPI.dispose);
Mock.mock(/\/attackEvent\/changeThreatLevel/, 'post', dashboardAPI.changeThreatLevel);

// 平台运行状况
Mock.mock(/\/platRunState\/list/, 'get', platRunStateAPI.getList);

// 策略配置
Mock.mock(/\/strategy\/list/, 'get', strategyAPI.getList);

// 用户绑定
Mock.mock(/\/userIp\/list/, 'get', userIpAPI.getList);
Mock.mock(/\/userIp\/update/, 'post', userIpAPI.updateArticle);

// 规则库
Mock.mock(/\/ruleBase\/list/, 'get', ruleBaseAPI.getList);

// 编辑事件等级
Mock.mock(/\/editEventLevel\/list/, 'get', editEventLevelAPI.getList);
Mock.mock(/\/editEventLevel\/update/, 'post', editEventLevelAPI.updateArticle);
Mock.mock(/\/editEventLevel\/create/, 'post', editEventLevelAPI.createArticle);

// 采集策略
Mock.mock(/\/collectStrategy\/list/, 'get', collectStrategyAPI.getList);
Mock.mock(/\/collectStrategy\/update/, 'post', collectStrategyAPI.updateArticle);
Mock.mock(/\/collectStrategy\/delete/, 'post', collectStrategyAPI.deleteArticle);
Mock.mock(/\/collectStrategy\/create/, 'post', collectStrategyAPI.createArticle);

// 测试代码
Mock.mock(/\/test\/list/, 'get', testAPI.getList);
Mock.mock(/\/test\/update/, 'post', testAPI.handleUpdate);
Mock.mock(/\/test\/edit/, 'post', testAPI.handleEdit);
Mock.mock(/\/test\/delete/, 'post', testAPI.handleDel);
Mock.mock(/\/test\/create/, 'post', testAPI.handleAdd);
export default Mock;
