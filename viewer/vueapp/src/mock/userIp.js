import Mock from 'mockjs';
import { param2Obj } from '@/api/index';

const List = [];

List.push(Mock.mock({
  id: 1,
  name: 'admin',
  bindIp: '192.168.8.8',
  times: '5',
  lastIp: '192.168.8.8',
  lockTime: 30,
  enabled: true
}));
List.push(Mock.mock({
  id: 2,
  name: 'zs',
  bindIp: '192.168.8.4',
  times: '5',
  lastIp: '192.168.8.198',
  lockTime: 30,
  enabled: true
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
    // console.log('userip', data);
    try {
      List.splice(data.id - 1, 1, data);
      return {
        success: true,
        msg: '更新成功'
      };
    } catch (e) {
      return {
        success: false,
        msg: e
      };
    }
  }
};
