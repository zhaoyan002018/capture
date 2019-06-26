import Cookies from 'js-cookie';

const TokenKey = 'DPS-COOKIE';
// 判断cookie中是否有TokenKey这个值
export function getToken () {
  return Cookies.get(TokenKey);
}

export function setToken (token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken () {
  return Cookies.remove(TokenKey);
}
