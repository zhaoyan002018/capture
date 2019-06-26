import Mock from 'mockjs';
import { param2Obj } from '@/api/index';

const List = [];
// const count = 1;

// for (let j = 0; j < count; j++) {
//   List.push(Mock.mock({
//     id: j + 1,
//     name: '账户策略',
//     version: '1.1.0',
//     introduce: '255.255.255.0'
//   }));
// }
List.push(Mock.mock({
  id: 1,
  name: '账户策略',
  introduce: '密码和账户锁定策略'
}));
List.push(Mock.mock({
  id: 2,
  name: '本地策略',
  introduce: '审核，用户权利和安全选项策略'
}));

export default {
  getList: (config) => {
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
  }
};
