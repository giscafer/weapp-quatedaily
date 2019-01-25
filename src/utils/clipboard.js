/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-12-17 10:03:51
 * @description: 复制封装提示，统一使用，减少相关多余代码
 */


import Taro from '@tarojs/taro';

export const copy = (data, text = '复制成功', showMsg = true) => {
  if (typeof data === 'number') {
    data = data + '';
  }
  Taro.setClipboardData({
    data: data || ''
  }).then(() => {
    if (showMsg) {
      Taro.showToast({
        title: text,
        icon: 'none'
      })
    }
  }).catch(() => {
    if (showMsg) {
      Taro.showToast({
        title: '复制失败',
        icon: 'none'
      });
    }
  });
}

/* 获取clipboard上复制的文本 */
export const paste = () => {
  return new Promise((resolve, reject) => {
    Taro.getClipboardData().then((res) => {
      Taro.showToast({
        title: '获取成功',
        icon: 'none'
      });
      return resolve(res.data);
    }).catch((err) => {
      Taro.showToast({
        title: '获取失败',
        icon: 'none'
      });
      return reject(err)
    });
  })
}
