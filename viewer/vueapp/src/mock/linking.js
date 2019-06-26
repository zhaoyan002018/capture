import Mock from 'mockjs';
import { param2Obj } from '@/api/index';

const List = [];
const count = 25;

for (let j = 0; j < count; j++) {
  List.push(Mock.mock({
    id: j + 1,
    linkName: '核心数据链路',
    interfaces: ['eth1', 'eth2'],
    'runState|1': [true, false]
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
    let Objid = data.Objid;
    if (data.state !== undefined) {
      for (let i in Objid) {
        for (let v of List) {
          if (Objid[i] === v.id) {
            v.runState = data.state;
            const index = List.indexOf(v);
            List.splice(index, 1, v);
          }
        }
      }
    }
    return {
      text: 'success'
    };
  },
  deleteRoute: (config) => {
    const otemp = JSON.parse(config.body);
    for (let i in otemp) {
      for (let j of List) {
        if (otemp[i] === j.id) {
          const index = List.indexOf(j);
          List.splice(index, 1);
        }
      }
    }
    return {
      text: 'success'
    };
  },
  createArticle: (config) => {
    const otemp = JSON.parse(config.body);
    List.unshift(otemp);
    return {
      items: otemp,
      text: 'success'
    };
  },
  editArticle: (config) => {
    const data = JSON.parse(config.body);
    for (let i of List) {
      if (i.id === data.id) {
        let index = List.indexOf(i);
        List.splice(index, 1, data);
      }
    }
    return {
      text: 'success'
    };
  }
};
