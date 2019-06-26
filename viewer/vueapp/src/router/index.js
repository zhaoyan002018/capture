import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
import Stats from '@/components/stats/Stats';
// import Help from '@/components/help/Help';
import Files from '@/components/files/Files';
import Users from '@/components/users/Users';
import History from '@/components/history/History';
import Sessions from '@/components/sessions/Sessions';
import Spiview from '@/components/spiview/Spiview';
import Spigraph from '@/components/spigraph/Spigraph';
import Connections from '@/components/connections/Connections';
import Settings from '@/components/settings/Settings';
import Upload from '@/components/upload/Upload';
import Hunt from '@/components/hunt/Hunt';
import Dps404 from '@/components/utils/404';
import Layout from '@/components/layout/Layout';
import time from '@/components/time/time';
import routing from '@/components/routing/routing';
import linking from '@/components/linking/linking';
import interfaces from '@/components/interfaces/interfaces';
import Dashboard from '@/components/dashboard/index';
import attackEvents from '@/components/attackEvents/index';
import eventLevel from '@/components/eventLevel/index';
import WorldMap from '@/components/worldMap/index';
import China from '@/components/chinaMap/index';
import CollectStrategy from '@/components/collectStrategy/index';
import platRunState from '@/components/platformRunState/index';
import strategy from '@/components/strategy/index';
import userIp from '@/components/userIp/index';
import ruleBase from '@/components/ruleBase/index';
import exportReport from '@/components/exportReport/index';
import imageText from '@/components/imageText/index';
import dataStatistics from '@/components/dataStatistics/index';
import serverInfo from '@/components/serverInfo/index';
import trafficAudit from '@/components/trafficAudit/index';
import test from '@/components/test/index';
import test1 from '@/components/test1/index';
Vue.use(Router);

/* eslint-disable no-undef */
const router = new Router({
  mode: 'history',
  base: VENDOR_CONFIG.DPS_PATH,
  scrollBehavior: function (to, from, savedPosition) {
    if (to.hash) {
      let yoffset = 150;

      if (to.path === '/help') {
        yoffset = 50;
      }

      return {
        selector: to.hash,
        offset: { x: 0, y: yoffset }
      };
    }
  },
  routes: [
    {
      path: '/test',
      component: Layout,
      hidden: true,
      redirect: '/test/index',
      children: [
        {
          path: 'index',
          component: test,
          name: 'test',
          meta: { title: '公共组件测试' }
        }
      ]
    },
    {
      path: '/test1',
      component: Layout,
      hidden: true,
      redirect: '/test1/index',
      children: [
        {
          path: 'index',
          component: test1,
          name: 'test1',
          meta: { title: '公共组件测试1' }
        }
      ]
    },
    {
      path: '/dataStatistics',
      component: Layout,
      hidden: true,
      redirect: '/dataStatistics/index',
      children: [
        {
          path: 'index',
          component: dataStatistics,
          name: 'dataStatistics',
          meta: { title: '统计数据' }
        }
      ]
    },
    {
      path: '/dashboard',
      component: Layout,
      hidden: true,
      redirect: '/dashboard/index',
      children: [
        {
          path: 'index',
          component: Dashboard,
          name: 'dashboard',
          meta: { title: '首页' }
        }
      ]
    },
    {
      path: '/sessions',
      component: Layout,
      redirect: '/sessions/index',
      children: [
        {
          path: 'index',
          component: Sessions,
          name: 'sessions',
          meta: {title: '会话', link: 'sessions'}
        }
      ]
    },
    {
      path: '/spiview',
      component: Layout,
      redirect: '/spiview/index',
      children: [
        {
          path: 'index',
          component: Spiview,
          name: 'spiview',
          meta: {title: 'SPI视图', link: 'spiview'}
        }
      ]
    },
    {
      path: '/spigraph',
      component: Layout,
      name: 'spigraph',
      redirect: '/spigraph/spigraphindex',
      meta: {title: 'SPI图表', link: 'spigraph'},
      children: [
        {
          path: 'spigraphindex',
          component: Spigraph,
          name: 'spigraphindex',
          meta: {title: '图表', link: 'spigraph'},
          permission: true
        },
        {
          path: 'worldmap',
          component: WorldMap,
          name: 'worldmap',
          meta: {title: '世界地图', link: 'worldmap'},
          permission: true
        },
        {
          path: 'chinamap',
          component: China,
          name: 'chinamap',
          meta: {title: '国内地图', link: 'chinamap'},
          permission: true
        }
      ]
    },
    {
      path: '/connections',
      component: Layout,
      redirect: '/connections/index',
      children: [
        {
          path: 'index',
          component: Connections,
          name: 'connections',
          meta: {title: '连接', link: 'connections'}
        }
      ]
    },
    {
      path: '/files',
      component: Layout,
      children: [
        {
          path: 'index',
          component: Files,
          name: 'files',
          meta: {title: '文件', link: 'files'},
          permission: 'hideFiles',
          reverse: true
        }
      ]
    },
    {
      path: '/stats',
      component: Layout,
      children: [
        {
          path: 'index',
          component: Stats,
          name: 'stats',
          meta: {title: '状态', link: 'stats'},
          permission: 'hideStats',
          reverse: true
        }
      ]
    },
    {
      path: '/history',
      component: Layout,
      children: [
        {
          path: 'index',
          component: History,
          name: 'history',
          meta: {title: '操作日志', link: 'history'}
        }
      ]
    },
    {
      path: '/upload',
      component: Layout,
      children: [
        {
          path: 'index',
          component: Upload,
          name: 'upload',
          meta: { title: '导入', link: 'upload' },
          permission: 'canUpload'
        }
      ]

    },
    {
      path: '/settings',
      component: Layout,
      children: [
        {
          path: 'index',
          component: Settings,
          name: 'settings',
          meta: { title: '设置', link: 'settings' }
        }
      ]

    },
    {
      path: '/users',
      component: Layout,
      children: [
        {
          path: 'index',
          component: Users,
          name: 'users',
          meta: { title: '用户', link: 'users' }
        }
      ]
    },
    {
      path: '/network',
      alwaysShow: true,
      name: 'network',
      component: Layout,
      meta: { title: '网络配置', link: 'network' },
      permission: true,
      children: [
        {
          path: 'interfaces',
          name: 'interfaces',
          component: interfaces,
          meta: { title: '接口配置', link: 'interfaces' },
          permission: true
        },
        {
          path: 'routing',
          name: 'routing',
          component: routing,
          meta: { title: '路由配置', link: 'routing' },
          permission: true
        },
        {
          path: 'linking',
          name: 'linking',
          component: linking,
          meta: { title: '链路配置', link: 'linking' }
        }
      ]
    },
    {
      path: '/system',
      component: Layout,
      name: 'system',
      alwaysShow: true,
      meta: { title: '系统配置', link: 'system' },
      children: [
        {
          path: 'time',
          name: 'time',
          component: time,
          meta: { title: '时间配置', link: 'time' }
        },
        {
          path: 'platRunState',
          name: 'platRunState',
          component: platRunState,
          meta: { title: '平台运行状况', link: 'runState' }
        },
        {
          path: 'userIP',
          component: userIp,
          name: 'userIp',
          meta: {title: '用户绑定', link: 'userIp'}
        },
        {
          path: 'ruleBase',
          component: ruleBase,
          name: 'ruleBase',
          meta: { title: '规则库', link: 'ruleBase' }
        },
        {
          path: 'strategy',
          component: strategy,
          name: 'strategy',
          meta: { title: '策略配置', link: 'strategy' }
        },
        {
          path: 'collectStrategy',
          component: CollectStrategy,
          name: 'collectStrategy',
          meta: { title: '采集策略', link: 'collectStrategy' }
        },
        {
          path: 'imageText',
          component: imageText,
          name: 'imageText',
          meta: { title: '其他配置', link: 'imageText' }
        },
        {
          path: 'serverInfo',
          component: serverInfo,
          name: 'serverInfo',
          meta: { title: '服务器信息', link: 'serverInfo' }
        }
      ]
    },
    {
      path: '/eventconfigure',
      component: Layout,
      name: 'eventconfigure',
      alwaysShow: true,
      meta: { title: '事件配置', link: 'eventconfigure' },
      children: [
        {
          path: 'attackEvents',
          component: attackEvents,
          name: 'attackEvents',
          meta: { title: '攻击事件', link: 'attackEvents' }
        },
        {
          path: 'eventLevel',
          component: eventLevel,
          name: 'eventLevel',
          meta: { title: '事件级别配置', link: 'eventLevel' }
        }
      ]
    },
    {
      path: '/exportReport',
      component: Layout,
      children: [
        {
          path: 'index',
          component: exportReport,
          name: 'exportReport',
          meta: { title: '报表导出', link: 'exportReport' }
        }
      ]
    },
    {
      path: '/trafficAudit',
      component: Layout,
      children: [
        {
          path: 'index',
          component: trafficAudit,
          name: 'trafficAudit',
          meta: { title: '流量审计', link: 'trafficAudit' }
        }
      ]
    },
    // {
    //   path: ''
    // },
    {
      path: '/help',
      name: 'help',
      component: Sessions,
      hidden: true
    },
    {
      path: '/hunt',
      name: 'Hunt',
      component: Hunt,
      meta: { title: 'hunt', link: 'hunt' },
      hidden: true
    },
    {
      path: '*',
      name: 'Not Found',
      component: Dps404,
      hidden: true
    }
  ]
});

router.beforeEach((to, from, next) => {
  // // always use the expression in the url query parameter if the navigation
  // // was initiated from anything not in the moloch UI (browser forward/back btns)
  let state = true;
  // state = isRoute(constRouterMap, to);
  if (state) {
    if (!to.params.nav && store.state.expression !== to.query.expression) {
      store.commit('setExpression', to.query.expression);
    }
    //  let page = to.name || ' dps - ';
    let view = to.query.view ? ` - ${to.query.view}` : '';
    let expression = to.query.expression ? ` - ${to.query.expression}` : '';

    /* eslint-disable no-undef */
    let title = VENDOR_CONFIG.DPS_TITLE_CONFIG
      .replace(/( *_-expression|_expression)_/g, expression)
      .replace(/( *_-view|_view)_/g, view);

    document.title = title;

    next();
  } else {
    next({path: '*'});
  }
});

export default router;
