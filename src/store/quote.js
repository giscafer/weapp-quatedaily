import { observable, action } from 'mobx';
import dayjs from 'dayjs';
import promiseHandler from '../utils/promiseHandler';
import { anonymousPost } from '../services/http.services';


class quoteDailySore {

  constructor() {
  }

  @observable data = {};


  @action.bound
  async loadData() {
    let daystr = dayjs().format('YYYY-DD-MM');
    let [err, result] = await promiseHandler(anonymousPost(`/quote/quotes/${daystr}`));
    this.loading = false;
    if (err || !result) {
      // TODO:查询错误提示
      return;
    }
    this.data = result;
  }

}


export default new quoteDailySore();
