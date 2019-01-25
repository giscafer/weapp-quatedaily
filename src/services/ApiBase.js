/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-01-07 15:48:51
 * @description: API URL 基类，为了方便取得对应微服务的api url地址
 */


import { BASEURL, DOMAIN_API } from "../config/config";
import { post, anonymousPost, get } from "./http.services";

export default class ApiBase {
  constructor(base) {
    this._base = base;
  }

  get baseUrl() {
    return BASEURL;
  }

  get domainApi() {
    return DOMAIN_API;
  }

  getApiUrl(endpoint) {
    return `${this._base}${endpoint}`;
  }

  get(endpoint, params, showLoading) {
    const url = `${this._base}${endpoint}`;
    return get(url, params, showLoading);
  }
  post(endpoint, params, showLoading) {
    const url = `${this._base}${endpoint}`;
    return post(url, params, showLoading);
  }
  /**
   * 匿名请求
   * @param {*} endpoint
   * @param {*} params
   * @param {*} showLoading
   */
  anonymousPost(endpoint, params, showLoading) {
    const url = `${this._base}${endpoint}`;
    return anonymousPost(url, params, showLoading);
  }
}
