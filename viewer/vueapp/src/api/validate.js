/**
 * Created by jiachenpan on 16/11/18.
 */

// 路由导航拦截函数
export function isRoute (routes, item) {
  let state = false;
  for (let i in routes) {
    if (routes[i].children) {
      state = isRoute(routes[i].children, item);
      if (state) {
        return true;
      }
    } else {
      if (routes[i].name === item.name && !routes[i].hidden) {
        return true;
      } else if (routes[i].name === item.name && routes[i].enabled) {
        return true;
      } else if (item.name === 'Not Found') {
        return true;
      } else {
        state = false;
      }
    }
  }
  return state;
}

// export function isvalidUsername (str) {
//   const valid_map = ['admin', 'editor'];
//   return valid_map.indexOf(str.trim()) >= 0;
// }
// // 将字节速率转化成其他大小
// export function changeRate (val) {
//
// }
/**
 * @param {string|number} val 输入的将进行转化的值
 *
 * @return {string} 转化之后的结果
 * */
// 将字节转化成其他单位大小
export function changeSize (val, unit = 'B') {
  if (val < 0) {
    return -1;
  }
  let symbols = ['bytes', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];

  let exp = Math.floor(Math.log(val) / Math.log(2));
  if (exp < 1) {
    exp = 0;
  }
  let i = Math.floor(exp / 10);
  val = val / Math.pow(2, 10 * i);

  if (val.toString().length > val.toFixed(2).toString().length) {
    val = val.toFixed(2);
  }
  if (i > 0) {
    return val + ' ' + symbols[i] + unit;
  } else {
    return val + ' ' + symbols[i];
  }
}
/**
 * @param {string} type 密码框当前input的type类型，password|text
 * @param {string} name 在组件中v-model对应的值的名字
 * @param {Object} that 执行的上下文环境
 * */
// 密码的显示隐藏
export function showPassword (type, name, that) {
  if (type === 'password') {
    that[name] = 'text';
  } else if (type === 'text') {
    that[name] = 'password';
  }
}
/**
 *@param {Object} that 函数执行的环境
 * @param {string} msg 后端返回的消息或者自定义的消息
 * @param {string} type 提示信息的类型 success||error
 * */
// 返回信息提示
export function notify (that, msg, type) {
  that.$notify({
    message: msg,
    type: type,
    duration: 2000
  });
}
/**
 *@param {Object} that 函数执行的环境
 * @param {function} resover 如果确定继续执行时，将执行的方法
 * @param {string|Object|Array} row resover函数的参数
 * @param {string} msg 弹出的提示，告诉用户是否继续某项操作
 * */

// 是否继续操作
export function isContinue (that, resover, row, msg) {
  that.$confirm(msg, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    callback: action => {
      if (action === 'confirm') {
        resover(row);
      } else {
        that.$notify({
          message: '已取消',
          type: 'info',
          duration: 2000
        });
      }
    }
  });
}
/* 全为半角英文标点符号 */
export function isEnglishSymbol (str) {
  const iseng = /^[;.\-a-zA-Z0-9]+$/g;
  return iseng.test(str);
}
/* 不能以除分号之外的符号结尾 */
export function endSymbol (str) {
  const reg = /[0-9;]$/g;
  return reg.test(str);
}
/* 端口的大小 */
export function enabledPort (str) {
  const msg = str >= 0 && str < 65535;
  return msg;
}

/* 合法IP */
export function isipcheck (str) {
  const ipreg = /^([1-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])(\.([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])){3}$/gi;
  return ipreg.test(str);
}
// IP转成整型
export function ipToInt (ip) {
  let num = 0;
  ip = ip.split('.');
  num = Number(ip[0]) * 256 * 256 * 256 + Number(ip[1]) * 256 * 256 + Number(ip[2]) * 256 + Number(ip[3]);
  num = num >>> 0;
  return num;
}
// 整型解析为IP地址
export function intToIp (num) {
  let str;
  let tt = [];
  tt[0] = (num >>> 24) >>> 0;
  tt[1] = ((num << 8) >>> 24) >>> 0;
  tt[2] = (num << 16) >>> 24;
  tt[3] = (num << 24) >>> 24;
  str = String(tt[0]) + '.' + String(tt[1]) + '.' + String(tt[2]) + '.' + String(tt[3]);
  return str;
}
/* 合法uri */
export function validateURL (textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}
/* 合法邮箱 */
// export function telnetCheck (str) {
//   const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
//   return reg.test(str);
// }

/* 含英文字母 */
export function hasEng (val) {
  const reg = /[a-zA-Z]+/g;
  return reg.test(val);
}

/* 小写字母 */
export function validateLowerCase (str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 全是数字 */
export function isNumber (val) {
  const reg = /^[0-9]+$/g;
  return reg.test(val);
}

/* 大写字母 */
export function validateUpperCase (str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母 */
export function validatAlphabets (str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}
