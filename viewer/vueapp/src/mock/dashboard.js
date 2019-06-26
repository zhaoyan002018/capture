import Mock from 'mockjs';
import { param2Obj } from '@/api/index';

const List = [];
const count = 11;

const Info = {
  'buu.211360.com': 'TheOthers，异鬼是一种通过国内几大知名下载站的高速下载器传播的流氓推广程序，其隐藏在正规软件中，带有官方数字签名，并且通过改写VBR来隐藏、保护自身，最终实际的推广流氓模块均由云端下发，主要目的是篡改浏览器主页、劫持导航网站、后台刷流量等。',
  'iqp.sjime.com': 'TheOthers，异鬼是一种通过国内几大知名下载站的高速下载器传播的流氓推广程序，其隐藏在正规软件中，带有官方数字签名，并且通过改写VBR来隐藏、保护自身，最终实际的推广流氓模块均由云端下发，主要目的是篡改浏览器主页、劫持导航网站、后台刷流量等。'
};

for (let j = 0; j < count; j++) {
  List.push(Mock.mock({
    id: j + 1,
    commProtocol: '通信协议',
    'threatLevel|1': [ 1, 2, 3 ],
    'attackIp|1': ['0.0.0.0', '192.168.155.169', '1.1.2.6', '192.168.8.163'],
    'victIp|1': ['0.0.0.0', '192.168.155.169', '1.1.2.6', '192.168.8.163', '127.0.0.1'],
    findTime: 1553915405 + j,
    threatLabel: '威胁情报',
    tag: ['虚拟货币挖矿', 'Necurs僵尸网络'],
    'event_des|1': ['主机网络流量命中僵尸网络（Necurs）情报指标', '主机对内网发起邮件撞库攻击'],
    'principle': 'Necurs是一种僵尸网络，它通过垃圾电子邮件和代理模块的方式进行传播。在感染主机上，Necurs会植入XMRig门罗币矿工，占用僵尸机的CPU资源来进行挖矿操作。攻击者通过使用白名单中的IP地址合法电子邮件客户端发送Necurs病毒的技术，使得病毒更加隐蔽，杀软查杀难度很大。',
    'damage': '1、过度耗费计算机CPU和GPU资源，影响系统性能。\n2、病毒感染主机后，可以在主机中进行窃取用户的敏感信息，发送到病毒的C&C服务器中。',
    'suggest': '1、确认该主机是否为DNS服务器或域控服务器（通常用于DNS代理），如果是请将该主机IP添加到失陷主机白名单即可；\n2、如以上推荐工具查杀不出来，可使用第三方杀毒工具（如火绒等）进行查杀；\n\n日常维护：\n1、不随意打开来历不明的邮件及附件；',
    AssDomainName: ['buu.211360.com', 'iqp.sjime.com'],
    threatTimes: Math.ceil(Math.random() * 20),
    attIpLabel: 'TheOthers流氓推广活动事件',
    attLabelType: '流氓推广',
    victIpLabel: '内网服务器',
    state: 1,
    MAC: '70-77-81-C7-51-F5',
    detailIntr: {},
    att_times: parseInt(Math.random() * 10),
    att_addr: '北京'
  }));
}

export default {
  getList: config => {
    // let VicHit = {}; // 威胁情报命中
    // 给每一行添加详细介绍
    for (let i in List) {
      for (let j in List[i].AssDomainName) {
        // if(VicHit[i]){
        // }
        List[i].detailIntr[List[i].AssDomainName[j]] = Info[List[i].AssDomainName[j]];
      }
    }

    let mockList = [];
    let item = [];
    let { length, start, filter, dashboard } = param2Obj(config.url);
    if (!dashboard) {
      if (filter) {
        // 将传过来的ip按';'切分成数组
        let filters = filter.split(';');
        for (let i = 0; i < filters.length; i++) {
          for (let j of List) {
            if (!(j.attackIp !== filters[i] && j.victIp !== filters[i])) {
              mockList.push(j);
            }
          }
        }
      } else {
        mockList = List;
      }
      for (let i = 0; i < length && start < mockList.length; i++) { // 取length个数据，从start开始取数据
        item.push(mockList[start]);
        start++;
      }
    } else {
      mockList = List;
      item = mockList;
    }
    return {
      total: mockList.length,
      items: item,
      recordsFiltered: mockList.length
    };
  },
  dispose: config => {
    let disposeData = JSON.parse(config.body);
    // let item = {};
    for (let j in disposeData) {
      for (let i in List) {
        if (List[i].id === disposeData[j]) {
          List[i].state = 2;
          // item = List[i];
        }
      }
    }
    return {
      msg: '处理成功',
      success: true
    };
  },
  changeThreatLevel: config => {
    let data = JSON.parse(config.body);
    List[data.id - 1].threatLevel = data.threatLevel;
    return {
      msg: '处理成功',
      success: true
    };
  }
};
