import Taro from '@tarojs/taro';
import dayjs from 'dayjs';
import { action, observable } from 'mobx';
import { APPID, APPSECRET, SHANBEI_URL } from '../config/config';
import ApiBase from '../services/ApiBase';
import { get, anonymousPost } from '../services/http.services';
import promiseHandler from '../utils/promiseHandler';

class quoteDailySore extends ApiBase {
  constructor() {
    super(SHANBEI_URL);
  }

  @observable data = {};

  @action.bound
  async loadData(page) {
    let daystr = dayjs()
      .subtract(page, 'day')
      .format('YYYY-MM-DD');
    // console.log(daystr);
    let [err, result] = await promiseHandler(
      this.get(`/quote/quotes/${daystr}/`)
    );
    if (err || !result) {
      // TODO:查询错误提示
      return false;
    }
    if (result.status_code === 0) {
      this.data = result.data;
      return true;
    }
    if (result.status_code === 1) {
      this.data = result.data;
      Taro.showToast({
        title: result.msg,
        icon: 'none',
        duration: 3000
      });
      return true;
    }
    return false;
  }

  // https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140183
  @action.bound
  async getToken() {
    let [err, result] = await promiseHandler(
      get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`
      )
    );
    if (err || !result) {
      // TODO:查询错误提示
      Taro.showToast({
        title: '获取微信token失败',
        icon: 'none'
      });
      return null;
    }
    console.log(result);
    return result.access_token;
  }

  async getQrCode(accessToken) {
    let [err, result] = await promiseHandler(
      anonymousPost(
        `https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token=${accessToken}`,
        {
          path: 'pages/index/index',
          width: '280'
        }
      )
    );
    if (err) {
      // TODO:查询错误提示
      Taro.showToast({
        title: '获取小程序二维码失败',
        icon: 'none'
      });
      return null;
    }
    const blob = new Blob([result]);
    const data = Taro.createObjectURL(blob);
    console.log(data);
    return data;
  }
}

export default new quoteDailySore();
