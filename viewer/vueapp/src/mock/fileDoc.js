import Mock from 'mockjs';
import { param2Obj } from '@/api/index';

const List = [];
const count = 25;

for (let j = 0; j < count; j++) {
  List.push(Mock.mock({
    num: j + 1,
    MD5: null,
    captureTime: '2019-03-08 09:50:48',
    charset: '',
    destCity: '乌海',
    destCountry: '中国',
    destIp: '110.7.18.142',
    destLatitude: '39.673734',
    destLongitude: '106.825563',
    destPort: '80',
    destProvince: '内蒙古',
    encoding: '',
    'fileID|1': ['http_20190308095048_000156ac.jpeg', 'http_20190308095048_000156ac.gif', 'http_20190308095048_000156ac.pdf'],
    fileSize: 960116,
    fileType: 'PIC',
    host: 'www.eyeprotect.wallpaperm.cmcm.com',
    id: 'http_20190308095048_000156ac',
    'proto|1': ['HTTP', 'FTP', 'HTTPS'],
    referer: '',
    request: 'GET',
    scanAddDate: null,
    scanDes: null,
    scanResult: null,
    srcCity: '北京市',
    srcCountry: '中国',
    srcIp: '192.168.11.10',
    srcLatitude: '39.90',
    srcLongitude: '116.40',
    srcPort: '50723',
    srcProvince: '北京',
    state: 1,
    url: '/healthpaper_2/e2ce9dfeb2211f412c478e489419f632.jpg',
    _id: '5c81dacad60cec06b967762d'
  }));
}

export default {
  getList: config => {
    let { start, length, filter } = param2Obj(config.url);
    filter = JSON.parse(filter);
    let result = [];
    let item = [];
    for (let i = 0; i < List.length; i++) {
      result.push(List[i]);
    }
    // 如果有搜索条件
    // 按文件类型搜索
    if (filter.fileType || filter.httpList || filter.handleSearch[0] || filter.handleSearch[1]) {
      // 对result 进行筛选
      let result1 = [];//
      let result2 = [];
      let result3 = [];
      if (filter.httpList) {
        for (let i in result) {
          let httpProto = result[i].proto;
          for (let j in filter.httpList) {
            if (httpProto === filter.httpList[j]) {
              result1.push(result[i]);
            }
          }
        }
      } else {
        result1 = result;
      }
      if (filter.fileType) {
        for (let i in result1) {
          let type = result1[i].fileID.split('.')[1];
          for (let j in filter.fileType) {
            if (type === filter.fileType[j]) {
              result2.push(result1[i]);
            }
          }
        }
      } else {
        result2 = result1;
      }

      if (filter.handleSearch[0] || filter.handleSearch[1]) {
        for (let i in result2) {
          if (result2[i].srcIp === filter.handleSearch[0] || result2.destIp === filter.handleSearch[1]) {
            result3.push(result2[i]);
          }
        }
      } else {
        result3 = result2;
      }
      result.length = 0;
      result = result3;
    }
    // 分页
    for (let i = 0; i < length && start < result.length; i++) {
      item.push(result[start]);
      start++;
    }
    return {
      total: result.length,
      items: item
    };
  }
};
