import request from '@/api/request';

export function fetcharticle (query, url) {
  console.log('url', url);
  return request({
    url: '/' + url + '/list',
    method: 'get',
    params: query
  });
}
export function fetchNetarticle (query, url) {
  return request({
    url: '/network/' + url,
    method: 'get',
    params: query
  });
}
export function getarticle (query) {
  return request({
    url: '/platRunState/list',
    method: 'get',
    params: query
  });
}

export function toggleArticle (data) {
  return request({
    url: '/interface/toggle',
    method: 'post',
    data
  });
}

export function updateThreatLevel (data) {
  return request({
    url: '/attackEvent/changeThreatLevel',
    method: 'post',
    data
  });
}

export function fetchPv (pv) {
  return request({
    url: '/article/pv',
    method: 'get',
    params: { pv }
  });
}

export function createArticle (data, url) {
  return request({
    url: '/' + url + '/create',
    method: 'post',
    data
  });
}
export function addArticle (data, url) {
  return request({
    url: '/network/' + url,
    method: 'post',
    data
  });
}

export function updateArticle (data, url) {
  return request({
    url: '/network/' + url,
    method: 'post',
    data
  });
}

export function updateRoute (data) {
  return request({
    url: '/routing/update',
    method: 'post',
    data
  });
}

export function updatearticle (data, url) {
  return request({
    url: '/' + url + '/update',
    method: 'post',
    data
  });
}
export function editUpdatearticle (data, url) {
  return request({
    url: '/' + url + '/edit',
    method: 'post',
    data
  });
}

export function deleteRoute (data) {
  return request({
    url: '/routing/delete',
    method: 'post',
    data
  });
}
export function deleteacticle (data, url) {
  return request({
    url: '/' + url + '/delete',
    method: 'post',
    data
  });
}
export function delActicle (data, url) {
  return request({
    url: '/network/' + url,
    method: 'post',
    data
  });
}

export function DisposeEvents (data) {
  return request({
    url: '/disposeEvent',
    method: 'post',
    data
  });
}

export function Timesync (data) {
  return request({
    url: '/timesync',
    method: 'post',
    data
  });
}
