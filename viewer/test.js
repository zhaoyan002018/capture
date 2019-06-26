'use strict';
// function timeOut(ms){
//   return new Promise(function(resolve,reject){
//     console.log(resolve);
//     console.log(setTimeout(resolve,ms,'done'));
//     return setTimeout(resolve,ms,'done');
//   });
// }
// timeOut(3000).then(function(value) {
//   console.log(value);
// });
function test (resolve, reject) {
  let timeOut = Math.random()*2;
  console.log(`set timeout to :${timeOut}seconds`);
  setTimeout(function () {
      if (timeOut < 1) {
        console.log(`call resolve()......`);
        resolve('200 Ok');
      } else {
        console.log(`call reject()......`);
        reject(`timeout in ${timeOut}seconds.`);
      }
  },timeOut*1000);
}
// test();
// var pi = new Promise(test);
// var p2 = pi.then(function (result) {
//   console.log(`成功：${result}`);
// });
// let p3 = p2.catch(function (reason) {
//   console.log(`失败:${reason}`);
// });
//
// new Promise(test).then(function (result) {
//   console.log(`成功${result}`);
// },function (result) {
//   console.log(`失败:${result}`);
// });
// function multiply(input) {
//   console.log(`${input}*${input}...`);
//   if (input>1254789){
//     return input + input;
//   } else {
//     add(input*input);
//   }
// }
// function add(input) {
//   console.log(`${input}+${input}...`);
//   if (input > 1564789) {
//     return input;
//   } else {
//     multiply(input + input);
//   }
// }
// let result = add(3);
// console.log(result);

// var p1 = new Promise(function (resolve, reject) {
//   setTimeout(resolve, 500, 'P1');
// });
// var p2 = new Promise(function (resolve, reject) {
//   setTimeout(resolve, 600, 'P2');
// });
// // 同时执行p1和p2，并在它们都完成后执行then:
// Promise.all([p1, p2]).then(function (results) {
//   console.log(results); // 获得一个Array: ['P1', 'P2']
// });

// async function asyncAwaitFn (str) {
//     return await new Promise((resolve, reject) => {
//        setTimeout(() => {
//          resolve(str);
//        }, 1000);
//     });
// }
// const serialFn = async () => {
//     //串行执行
//     console.time('serialFn');
//     console.log(await asyncAwaitFn('string 1'));
//     console.log(await asyncAwaitFn('string 2'));
//     console.timeEnd('serialFn');
// };
// serialFn();
// const parallel = async () => { //并行执行
//     console.time('parallel');
//     const parallelOne = asyncAwaitFn('string 1');
//     const parallelTwo = asyncAwaitFn('string 2');
//     //直接打印
//     console.log(await parallelOne)
//     console.log(await parallelTwo)
//     console.timeEnd('parallel')
// };
// parallel();
// var propOrders = { "prop1":"asc", "prop2":"desc", "prop3":"asc"};
// propOrders = 'asc'
// function cmp(item1, item2, propOrders) {
//     let cps = []; // 用于记录各个排序属性的比较结果，-1 | 0 | 1 。
//     let isAsc = propOrders === "asc";
//     if(item1 > item2) {
//         cps.push(isAsc ? 1 : -1);
//         // break; // 可以跳出循环了，因为这里就已经知道 item1 “大于” item2 了。
//     } else if(item1 === item2) {
//         cps.push(0);
//     } else {
//         cps.push(isAsc ? -1 : 1);
//         // break; // 可以跳出循环，item1 “小于” item2。
//     }
//     for(var j = 0; j < cps.length; j++) {
//         if(cps[j] === 1 || cps[j] === -1) {
//             return cps[j];
//         }
//     }
//     console.log(cps);
//     return 0;
// }
var list = [ { name: 'Edward', value: 21 },
    { name: 'Sharpe', value: 37 },
    { name: 'And', value: 45 },
    { name: 'Edward', value: -12 },
    { name: 'Magnetic', value: 21 },
    { name: 'Zeros', value: 37 }
];
// for(var j = 0; j < cps.length; j++) {
//     if(cps[j] === 1 || cps[j] === -1) {
//         return cps[j];
//     }
// }
// return 0;
//假设有一个数组对象，根据id从小到大排序
// var list = [
//     { name: "zhangsan", id: "45"},
//     { name: "bocai", id: "21"},
//     { name: "qingyi", id: "33"}
// ];
// console.log('beforeSort', list);
//定义一个函数
function compare(pro) {
    return function (obj1, obj2) {
        var val1 = obj1[pro];
        var val2 = obj2[pro];
        if (val1 < val2 ) { //正序
            return 1;
        } else if (val1 > val2 ) {
            return -1;
        } else {
            return 0;
        }
    };
}
//使用方法
list.sort(compare("value"));
// console.log('afterSort', list);

var obj=list.find(function (obj) {
    return obj.value === 21;
});
console.log('obj',obj);

