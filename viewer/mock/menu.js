const isDashboard = 'sessions';
const constRouterMap = [
  {
    name: 'dashboard',
    hidden: true,
    title: '首页',
    enabled: true
  },
  {
    name: 'sessions',
    title: '会话'
  },
  {
    name: 'spiview',
    title: 'SPI视图'
  },
  {
    name: 'spigraph',
    // hidden: true,
    title: 'SPI图表',
    children: [
      {
        name: 'spigraphindex',
        title: '图表'
      },
      {
        name: 'worldmap',
        title: '世界地图'
      },
      {
        name: 'chinamap',
        title: '国内地图'
      }
    ]
  },
  {
    name: 'connections',
    title: '连接'
  },
   {
    name: 'files',
    title: '文件'
   },
  {
    name: 'stats',
    title: '状态'
  },
  {
    name: 'history',
    title: '操作日志'
  },
  {
    name: 'upload',
    title: '导入'

  },
  {
    name: 'settings',
    title: '设置'
  },
  {
    name: 'users',
    title: '用户'
  },
  {
    name: 'network',
    title: '网络配置',
    children: [
      {
        name: 'interfaces',
        title: '接口配置'
      },
      {
        name: 'routing',
        title: '路由配置'
      },
      {
        name: 'linking',
        title: '链路配置'
      }
    ]
  },
  {
    name: 'system',
    title: '系统配置',
    children: [
      {
        name: 'time',
        title: '时间配置'
      },
      {
        name: 'platRunState',
        title: '平台运行状况'
      },
      {
        name: 'userIp',
        title: '用户绑定'
        // hidden: true
      },
      {
        name: 'ruleBase',
        title: '规则库'
      },
      {
        name: 'strategy',
        title: '策略配置'
      },
      {
        name: 'collectStrategy',
        title: '采集策略'
      },
      {
        name: 'imageText',
        title: '其他配置'
        // hidden: true
      }
    ]
  },
  {
    name: 'eventconfigure',
    title: '事件配置',
    children: [
      {
        name: 'attackEvents',
        title: '攻击日志'
      },
      {
        name: 'eventLevel',
        title: '事件级别配置'
      }
    ]
  },
  {
    name: 'exportReport',
    title: '报表导出'
  },
  {
    name: 'Hunt',
    title: 'hunt',
    hidden: true
  }
];
