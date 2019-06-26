import Mock from 'mockjs';
import { param2Obj } from '@/api/index';

const List = [];
const count = 25;

for (let j = 0; j < count; j++) {
  List.push(Mock.mock({
    id: j + 1,
    endIp: '10.251.251.251',
    nextJumpIp: '10.251.251.251/24',
    subnet: '255.255.255.0',
    interface: 'eth1',
    Metric: 1500
  }));
}

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
      items: data,
      text: 'upload success'
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
      text: 'delete success'
    };
  },
  createArticle: (config) => {
    const otemp = JSON.parse(config.body);
    List.unshift(otemp);
    return {
      items: otemp,
      text: 'create success'
    };
  }
};
