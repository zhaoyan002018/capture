import { param2Obj } from '@/api/index';

const item = {
  cpu: {
    ratio: [],
    time: []
  },
  memory: {
    ratio: [],
    time: [],
    used: 36984512,
    total: 3698547812
  },
  dist: {
    time: [],
    write: [],
    read: [],
    total: 254 * 1024 * 1024,
    inuse: 74521
  }
};

export default {
  getList: config => {
    let { open } = param2Obj(config.url);
    if (open) {
      let time = new Date().getTime() / 1000;
      let random = parseInt(Math.random() * 60);
      let cpuRatio = random + 10;
      let memoryRatio = random + parseInt(Math.random() * 5);
      let distWrite = random;
      let distRead = random % 2;
      item.cpu.time.push(time);
      item.cpu.ratio.push(cpuRatio);
      item.memory.time.push(time);
      item.memory.ratio.push(memoryRatio);
      item.dist.time.push(time);
      item.dist.write.push(distWrite);
      item.dist.read.push(distRead);

      // item.cpu.length > 120 && (function (item) {
      //   item.cpu.time.shift();
      //   item.cpu.ratio.shift();
      // })();
      // item.memory.length > 120 && (function (item) {
      //   item.memory.time.shift();
      //   item.memory.ratio.shift();
      // })();
      // 只传过来固定长度的数据，当数据超过一定长度时
      // let cpu_ratio = parseInt(Math.random()*10)
      return item;
    } else {
      return item;
    }
  }
};
