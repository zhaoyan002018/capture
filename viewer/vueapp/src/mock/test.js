import Mock from 'mockjs';
// import { param2Obj } from '@/api/index';

let List = [];
List.push(Mock.mock({
  time: 1560157332,
  srcIp: '192.168.8.5',
  dstIp: '192.168.8.16',
  srcPort: '46',
  packages: 9689865,
  node: 'localhost',
  dstPort: '56',
  bytes: '5496587425478',
  showDetails: true
}));
List.push(Mock.mock({
  time: 1560157342,
  srcIp: '192.168.8.6',
  dstIp: '192.168.8.96',
  srcPort: '46',
  packages: 968,
  node: 'localhost',
  dstPort: '56',
  bytes: '547',
  showDetails: true
}));
List.push(Mock.mock({
  time: 1560157432,
  srcIp: '192.168.6.3',
  dstIp: '192.168.6.9',
  srcPort: '65',
  packages: 8958,
  node: 'localhost',
  bytes: '5489481',
  dstPort: 96,
  showEdit: true
}));
List.push(Mock.mock({
  time: 1560158332,
  srcIp: '192.168.6.7',
  dstIp: '192.168.6.96',
  srcPort: '65',
  dstPort: 96,
  packages: 9658,
  node: 'localhost',
  bytes: '547681',
  showEdit: true,
  showRemove: true
}));
List.push(Mock.mock({
  time: 1560158392,
  srcIp: '192.168.6.7',
  dstIp: '192.168.6.96',
  srcPort: '65',
  dstPort: 96,
  packages: 9658,
  node: 'localhost',
  bytes: '547681',
  showEdit: true,
  showRemove: true
}));

let columns = ['time', 'srcIp', 'dstIp', 'srcPort', 'dstPort', 'packages'];
let allColumns = {
  time: { key: 'time', title: '时间', type: 'time', width: '90px', sortable: true, showOverflowTooltip: true },
  srcIp: { key: 'srcIp', title: '源Ip', type: 'string', sortable: true },
  dstIp: { key: 'dstIp', title: '目的Ip', type: 'string', sortable: true },
  srcPort: { key: 'srcPort', title: '源端口', type: 'number', sortable: true },
  dstPort: { key: 'dstPort', title: '目的端口', type: 'number', sortable: true },
  node: { key: 'node', title: '节点', type: 'string', sortable: true },
  packages: { key: 'packages', title: '数据包', type: 'size', sortable: true },
  bytes: { key: 'bytes', title: '字节数', type: 'bytes', sortable: true }
};

export default {
  getList: (config) => {
    return {
      data: List,
      columns: columns,
      allColumns: allColumns,
      length: List.length
    };
  },
  handleUpdate: (data) => {
    let { body } = data;
    let msg = '';
    let success = false;
    if (!body.length) {
      msg = '数据不能为空';
      success = false;
    } else {
      columns = JSON.parse(body);
      msg = '修改成功';
      success = true;
    }
    return {
      message: msg,
      success: success
    };
  },
  handleEdit: (data) => {
    let { index, row } = JSON.parse(data.body);
    let success = true;
    List.splice(index, 1, row);
    return {
      success: success,
      message: '修改成功'
    };
  },
  handleDel: (data) => {
    console.log('handleDel', data);
    try {
      let { index } = JSON.parse(data.body);
      List.splice(index, 1);
    } catch (e) {
      return {
        message: e,
        success: false
      };
    }
    return {
      message: '删除成功',
      success: true
    };
  },
  handleAdd: (data) => {
    let { row } = JSON.parse(data.body);
    try {
      List.push(row);
    } catch (e) {
      return {
        message: e,
        success: false
      };
    }
    return {
      message: '添加成功',
      success: true
    };
  }
};
