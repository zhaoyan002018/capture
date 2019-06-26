import Mock from 'mockjs';
import { param2Obj } from '@/api/index';

const List = [];

List.push(Mock.mock({
  id: 1,
  startTime: '1555553168',
  endTime: '1555568718',
  srcIp: '192.168.8.5',
  dstIp: '192.168.8.19',
  strategy: 'HTTP事件',
  level: 1,
  user: 'admin',
  enabled: true,
  checkEvent: [1.1, 1.2]
}));
List.push(Mock.mock({
  id: 2,
  startTime: '1555545968',
  endTime: '1555553168',
  srcIp: '192.168.8.15',
  dstIp: '192.168.8.119',
  strategy: 'HTTP事件',
  level: 2,
  user: 'zs',
  enabled: false,
  checkEvent: [1.3, 1.4]
}));
List.push(Mock.mock({
  id: 3,
  startTime: '1555559445',
  endTime: '1555559565',
  srcIp: '192.168.8.25',
  dstIp: '192.168.8.129',
  strategy: 'Telnet事件',
  level: 3,
  user: 'ls',
  enabled: false,
  checkEvent: [2.3, 2.2, 2.5]
}));

export default {
  getList: config => {
    let { start, length, filter } = param2Obj(config.url);
    let mockList = [];
    let item = [];
    // 如果有搜索条件
    if (filter) {

    } else {
      mockList = List;
    }
    // 分页
    for (let i = 0; i < length && start < mockList.length; i++) {
      item.push(mockList[start]);
      start++;
    }
    return {
      total: mockList.length,
      items: item
    };
  },
  updateArticle: (config) => {
    const data = JSON.parse(config.body);
    List.splice(data.id - 1, 1, data);
    return {
      // items: data,
      success: true,
      msg: '更新成功'
    };
  },
  deleteRoute: (config) => {
    const otemp = JSON.parse(config.body);
    for (const i in otemp) {
      for (const v of List) {
        if (otemp[i] === v.id) {
          const index = List.indexOf(v);
          List.splice(index, 1);
        }
      }
    }
    return {
      success: true,
      msg: '删除成功'
    };
  },
  createArticle: (config) => {
    const otemp = JSON.parse(config.body);
    List.unshift(otemp);
    return {
      success: true,
      msg: '添加成功'
    };
  }
};
