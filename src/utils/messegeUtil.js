/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2019-01-09 11:04:32
 * @description: 为了方便使用，简写
 */

import Taro from '@tarojs/taro'

/**
 * toast
 * @param {String} title 信息
 * @param {String} icon 图标类型
 */
export function showToast (title = '操作成功', duration = 2000 , icon = 'none', mask = true) {
  return new Promise((resolve, reject) => {
    Taro.showToast({
      title: title,
      icon: icon,
      duration: duration,
      mask: mask
    }).then(() => resolve())
      .catch(()=> reject())
  })
}

/**
 * toast && showLoading
 * @param {String} title 信息
 */
export function showLoading (title = '正在加载...') {
  return Taro.showLoading({
    title,
    mask: true
  })
}

/**
 * toast && hideloading
 * @param {String} title 信息
 * @param {String} icon 图标类型
 */
/* export function showToastAndHideLoading(title = '操作成功', icon = 'none') {
  Taro.hideLoading()
  return showToast(title, icon)
} */

export function showModal (content = '' , title = '提示') {
  return Taro.showModal({
    title,
  content})
}
