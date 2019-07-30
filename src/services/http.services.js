/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-12-07 11:28:33
 * @description: 请求包装，使用更简洁
 */

import Taro from '@tarojs/taro';
import { BASEURL } from '../config/config';
import { showToast, showLoading } from '../utils/messegeUtil';

const isSuccess = data => {
  return data && data.code && data.code === 2000;
  // return true
};
const isAuthFailured = data => {
  return data && data.code && data.code === 4100;
};

/**
 * 匿名请求，一些不需要token的请求
 */
export const anonymousPost = (endpoint, params, _showLoading = true) => {
  // const token = { Authorization: 'bearer anonymous' };
  return _post(endpoint, params, _showLoading);
};

/**
 * post请求
 * @param {String} endpoint 接口路径名称
 * @param {Object<any>} params 参数对象
 * @param {Boolean} _showLoading 是否全局展示请求loading
 */
function _post(endpoint, params, _showLoading = true, token = {}) {
  if (_showLoading) {
    showLoading('正在加载...');
  }
  return new Promise((resolve, reject) => {
    Taro.request({
      url: `${endpoint}`,
      method: 'POST',
      data: params,
      header: {
        'content-type': 'application/json',
        ...token
      }
    })
      .then(res => {
        const { statusCode, data, header = {} } = res;
        if (_showLoading) {
          Taro.hideLoading();
        }
        if (statusCode !== 200) {
          showToast(res.data.message);
          return reject(res);
        }
        if (
          header['Content-Type'] &&
          header['Content-Type'].indexOf('image') === 0
        ) {
          return resolve(data);
        }
        if (isSuccess(data)) {
          // 一般接口
          return resolve(data.data);
        }
        if (isAuthFailured(data)) {
          showToast(data.desc);
          return reject(data);
        }
        showToast(`服务异常,${data.desc}`);
        return reject(data);
        // return resolve(data.data);
      })
      .catch(err => {
        // do error handler
        if (_showLoading) {
          Taro.hideLoading();
        }
        return reject(err);
      });
  });
}

export const get = (URL, endpoint = '', _showLoading = true) => {
  if (_showLoading) {
    showLoading('正在加载...');
  }
  return new Promise((resolve, reject) => {
    Taro.request({
      url: endpoint ? `${BASEURL}${endpoint}` : URL,
      method: 'GET',
      header: {
        'content-type': 'application/json;charset=utf-8'
      }
    })
      .then(res => {
        if (_showLoading) {
          Taro.hideLoading();
        }
        const { statusCode, data } = res;
        if (statusCode !== 200) {
          return reject(res);
        }
        return resolve(data);
      })
      .catch(err => {
        // do error handler
        if (_showLoading) {
          Taro.hideLoading();
        }
        return reject(err);
      });
  });
};
