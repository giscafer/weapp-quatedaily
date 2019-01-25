import { observable, action } from 'mobx';
import dayjs from 'dayjs';
import promiseHandler from '../utils/promiseHandler';
import ApiBase from '../services/ApiBase';
import { SHANBEI_URL } from '../config/config';


class quoteDailySore extends ApiBase {

  constructor() {
    super(SHANBEI_URL)
  }

  @observable data = {};


  @action.bound
  async loadData(page) {
    let daystr = dayjs().subtract(page, 'day').format('YYYY-MM-DD');
    console.log(daystr)
    let [err, result] = await promiseHandler(this.get(`/quote/quotes/${daystr}/`));
    if (err || !result) {
      // TODO:查询错误提示
      return false;
    }
    if (result.status_code === 0) {
      this.data = result.data;
      return true;
    }
    return false;
  }

}


export default new quoteDailySore();
