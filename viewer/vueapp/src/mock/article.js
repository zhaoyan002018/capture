import Mock from 'mockjs';
import { param2Obj } from '@/api/index';

const List = [];
const count = 25;

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    index: '@increment',
    name: 'eth1',
    mtu: 1500,
    addrs: ['10.251.251.251/24', 'fe80::20c:29ff:fe02:3c4b/64'],
    Link: ['等保1区', '等保2区', ''],
    'state|1': ['UP', 'Down'],
    'enabled|1': [true, false]
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
  togleState: (config) => {
    const data = JSON.parse(config.body);
    let Objid = data.Objid;
    for (let i in Objid) {
      for (let j of List) {
        if (Objid[i] === j.id) {
          j.ping = data.state;
          const index = List.indexOf(j);
          List.splice(index, 1, j);
        }
      }
    }
    return {
      text: 'success'
    };
  },
  updateArticle: (config) => {
    const data = JSON.parse(config.body);
    List.splice(data.id - 1, 1, data);
    return {
      text: 'success'
    };
  }
};
