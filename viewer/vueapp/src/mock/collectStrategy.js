import Mock from 'mockjs';
import { param2Obj } from '@/api/index';

const List = [];

List.push(Mock.mock({
  id: 1,
  name: 'name1',
  proto: { or: ['HTTP'], not: ['FTP'] },
  port: {
    srcPort: { or: ['99', '8080'], not: ['4430'] },
    dstPort: { or: ['99', '8080'], not: ['4430'] }
  },
  addr: {
    srcIp: { or: ['192.168.8.18', '192.168.8.6'], not: ['192.168.8.7'] },
    dstIp: { or: ['192.168.8.0'], not: ['192.168.8.4', '192.168.8.19'] } },
  enabled: true
}));
List.push(Mock.mock({
  id: 2,
  name: 'name2',
  proto: { or: ['HTTP', 'FTP', 'pop3'], not: [] },
  port: {
    srcPort: { or: ['80', '90'], not: ['660'] },
    dstPort: { or: ['99', '8080'], not: ['4430'] }
  },
  addr: {
    srcIp: { or: ['192.168.8.18', '192.168.8.6'], not: ['192.168.8.7'] },
    dstIp: { or: ['192.168.8.0'], not: ['192.168.8.4', '192.168.8.19'] } },
  enabled: false
}));
List.push(Mock.mock({
  id: 3,
  name: 'name3',
  proto: { not: ['HTTP', 'FTP', 'pop3'], or: [] },
  port: {
    srcPort: { or: ['80', '90'], not: ['660'] },
    dstPort: { or: ['99', '8080'], not: ['4430'] }
  },
  addr: {
    srcIp: { or: ['192.168.8.18', '192.168.8.6'], not: ['192.168.8.7'] },
    dstIp: { or: ['192.168.8.0'], not: ['192.168.8.4', '192.168.8.19'] } },
  enabled: true
}));
List.push(Mock.mock({
  id: 4,
  name: 'name4',
  proto: { not: ['HTTP', 'FTP', 'pop3'], or: ['telNet', 'SMTP'] },
  port: {
    srcPort: { or: ['80', '90'], not: ['660'] },
    dstPort: { or: ['99', '8080'], not: ['4430'] }
  },
  addr: {
    srcIp: { or: ['192.168.8.18', '192.168.8.6'], not: ['192.168.8.7'] },
    dstIp: { or: ['192.168.8.0'], not: ['192.168.8.4', '192.168.8.19'] } },
  enabled: false
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
  deleteArticle: (config) => {
    const otemp = JSON.parse(config.body);
    List.splice(otemp.id - 1, 1);
    return {
      success: true,
      msg: '删除成功'
    };
  },
  createArticle: (config) => {
    const otemp = JSON.parse(config.body);
    // console.log('otemp', otemp);
    List.unshift(otemp);
    return {
      success: true,
      msg: '添加成功'
    };
  }
};
