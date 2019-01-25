/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-12-10 17:25:12
 * @description: 拼图，html生成图片
 * TODO: 支持多种排版拼图
 */

import Taro from '@tarojs/taro';
import { copy } from '../utils/clipboard';
import { EventProxy } from '../utils/EventProxy';
import ImageZoom from '../utils/ImageZoom';
import { showToast } from '../utils/messegeUtil';

/**
 * 合成图（新版四图组合+描述）：788*1382 ——宽高固定
 * 单张图（商品首图+描述）：1000*1285 —— 宽高固定
 * 四张图（描述默认复制）：图片默认大小
 * 合成4图（四图组合+描述）： auto * 1080——高度固定，宽度自适应，但不会差别太大
 */
const IMAGE_PUZZLES_STYLE = {
  // 合成图
  composite_graph: {
    width: 788,
    height: 1382,
    thumbSize: 235,
    topTextHeight: 200,
  },
  // 单张图
  single_graph: {
    width: 1000,
    height: 1285,
    topTextHeight: 200,
  },
  // 合成4图
  composite_four_graph: {
    height: 1080,
  },
};

export const html2Canvas = html => {
  console.log(html);
};

/**
 * 网络图片拼图
 * @param {String} canvasId canvas id,canvas的宽度和高度要和图片模块的一致
 * @param  {...any} imgUrls image url array
 * @param  {string} puzzlesType puzzle image type
 */
export const images2Canvas = options => {
  const { canvasId, imgUrls, puzzlesType, description } = options;
  if (!imgUrls.length) throw new Error('image urls is neccessary');
  let promiseList = [];
  for (const url of imgUrls) {
    promiseList.push(Taro.getImageInfo({ src: url }));
  }
  Taro.showLoading({ title: '下载图片中…' });
  Promise.all(promiseList).then(res => {
    if (puzzlesType === 'composite_graph') {
      compositeGraph(res, canvasId, description);
    } else if (puzzlesType === 'single_graph') {
      singleGraph(res[0], canvasId, description);
    }
  });
};

/**
 * 根据canvas保存图片到相册
 * @param {String} canvasId canvas html id
 */
export const saveCanvasToPhotosAlbum = canvasId => {
  Taro.canvasToTempFilePath({ canvasId: canvasId })
    .then(res => {
      return Taro.saveImageToPhotosAlbum({ filePath: res.tempFilePath });
    })
    .then(res => {
      console.log(res);
      Taro.showToast({ title: '已保存到相册' });
    })
    .catch(() => {
      Taro.hideLoading();
    });
};

/**
 * 拼图，首张大图，其余小图
 * @param {Array} res 图片对象数组
 * @param {*} canvasId canvas id
 * @param {Object} desc product description
 */
function compositeGraph(res, canvasId, desc) {
  const ctx = Taro.createCanvasContext(canvasId);
  Taro.showLoading({
    title: '正在拼图…',
  });
  // console.log(res);
  // 大小
  const { width, height, thumbSize, topTextHeight } = IMAGE_PUZZLES_STYLE.composite_graph;
  const [img1, img2, img3, img4] = res;
  const imageHeight = height - thumbSize - topTextHeight - 40;
  const imageZoom = new ImageZoom(img1.width, img1.height, width, imageHeight);
  imageZoom.setMaxWidthAndHeight();
  ctx.setFillStyle('#fff');
  ctx.fillRect(0, 0, width, height);
  // console.log(imageZoom);
  ctx.strokeStyle = '#aaa';
  drawImageAndRect(ctx, img1.path, 20, topTextHeight, imageZoom.width - 40, imageZoom.height);
  // 文本
  ctx.setTextAlign('left');
  ctx.setFillStyle('#000');
  ctx.setFontSize(22);
  let title = desc.title;
  const titleY = wrapText(ctx, title, 30, 30, 300, 28);
  ctx.setFontSize(18);
  ctx.fillText('特价：', 30, titleY + 28);
  ctx.setFontSize(22);
  ctx.setFillStyle('#f5090c');
  ctx.fillText('¥' + desc.price, 70, titleY + 28);

  // 其他三图
  const offsetY = height - thumbSize - 20;
  ctx.strokeStyle = '#aaa';
  drawImageAndRect(ctx, img2.path, 20, offsetY, thumbSize, thumbSize);
  drawImageAndRect(ctx, img3.path, thumbSize + 20 + 20, offsetY, thumbSize, thumbSize);
  drawImageAndRect(ctx, img4.path, thumbSize * 2 + 20 * 2 + 20, offsetY, thumbSize, thumbSize);

  ctx.stroke();
  ctx.draw(false, () => {
    Taro.showLoading({
      title: '保存到本地……',
    });
    saveCanvasToPhotosAlbum(canvasId);
  });
}

/**
 * 拼图，单图+描述
 * @param {Obejct} image 图片对象
 * @param {*} canvasId canvas id
 * @param {Object} desc product description
 */
function singleGraph(image, canvasId, desc) {
  const ctx = Taro.createCanvasContext(canvasId);
  Taro.showLoading({
    title: '正在拼图…',
  });
  // console.log(res);
  // 大小
  const { width, height, topTextHeight } = IMAGE_PUZZLES_STYLE.single_graph;
  const imageHeight = height - topTextHeight - 20;
  const imageZoom = new ImageZoom(image.width, image.height, width, imageHeight);
  imageZoom.setMaxWidthAndHeight();
  ctx.setFillStyle('#fff');
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#aaa';
  drawImageAndRect(ctx, image.path, 20, topTextHeight, imageZoom.width - 40, imageZoom.height);
  // 文本
  ctx.setTextAlign('left');
  ctx.setFillStyle('#000');
  ctx.setFontSize(22);
  let title = desc.title;
  const titleY = wrapText(ctx, title, 30, 30, 300, 28);
  ctx.setFontSize(18);
  ctx.fillText('特价：', 30, titleY + 28);
  ctx.setFontSize(22);
  ctx.setFillStyle('#f5090c');
  ctx.fillText('¥' + desc.price, 70, titleY + 28);

  ctx.stroke();
  ctx.draw(false, () => {
    Taro.showLoading({
      title: '保存到本地……',
    });
    saveCanvasToPhotosAlbum(canvasId);
  });
}

/**
 * 图片下载
 * @param {Array} res 图片对象数组
 * @param {Object} description 文字描述对象
 */
export function downloadFiles(options) {
  const { imgUrls, description } = options;
  if (!imgUrls.length) throw new Error('image urls is neccessary');
  let promiseList = [];
  for (const url of imgUrls) {
    promiseList.push(Taro.downloadFile({ url: url }));
  }
  Taro.showLoading({ title: '下载图片中…' });
  const proxy = new EventProxy();
  Promise.all(promiseList).then(res => {
    // 此处做异步保存并计数，比如保存第一张，2张、3张…
    proxy.after('download_files', res.length, data => {
      console.log(data);
      Taro.showToast({
        title: `全部保存成功！`,
      });
      // TODO copy description
      if (description) {
        copy(description, '已复制商品标题到剪贴板');
      }
    });
    let count = 0;
    // 异步保存
    res.forEach(item => {
      Taro.saveImageToPhotosAlbum({
        filePath: item.tempFilePath,
      })
        .then(() => {
          count++;
          showToast(`第 ${count} 张图片保存成功！`);
          proxy.trigger('download_files', item);
        })
        .catch(err => {
          count++;
          showToast(`第 ${count} 张图片保存成功！`);
          proxy.trigger('download_files', item);
          console.log(err);
        });
    });
    // 同步保存方案
    /* res.forEach(async (item, index) => {
      const [err, result] = await promiseHandler(Taro.saveImageToPhotosAlbum({ filePath: item.tempFilePath }));
      if (!err || !result) {
        Taro.showToast({ title: `第 ${index + 1} 张保存失败！` });
      }
      Taro.showToast({ title: `第 ${index + 1} 张保存成功！` });
    });
    Taro.showToast({ title: `全部保存成功！` }); */
  });
}

function drawImageAndRect(ctx, path, x, y, width, height) {
  ctx.strokeRect(x, y, width, height);
  ctx.drawImage(path, x, y, width, height);
}

/**
 * 自动文本换行绘制
 * @param {Object} ctx
 * @param {String} text 文本
 * @param {Number} x
 * @param {Number} y
 * @param {Number} maxWidth
 * @param {Number} lineHeight
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  if (typeof text != 'string' || typeof x != 'number' || typeof y != 'number') {
    return;
  }
  const context = ctx._context || ctx;
  let canvas = context.canvas;

  if (typeof maxWidth == 'undefined') {
    maxWidth = (canvas && canvas.width) || 300;
  }
  if (typeof lineHeight == 'undefined') {
    lineHeight = 20;
  }

  // 字符分隔为数组
  let arrText = text.split('');
  let line = '';

  for (let n = 0; n < arrText.length; n++) {
    let testLine = line + arrText[n];
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = arrText[n];
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
  return y;
}
