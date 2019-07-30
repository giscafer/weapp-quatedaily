/**
 * @author: giscafer ,https://github.com/giscafer
 * @date: 2018-12-11 15:09:06
 * @description: 图片缩放类
 */

export default class ImageZoom {
  /**
   * @param {number} width 图片宽度
   * @param {number} height 图片高度
   * @param {number} maxWidth 图片最大宽度
   * @param {number} maxHeight 图片最大高度
   */
  constructor(width, height, maxWidth, maxHeight) {
    if (typeof width !== 'number' || typeof height !== 'number')
      throw new Error('width or height must be a number');
    this.width = width;
    this.height = height;
    this.maxWidth = maxWidth || width;
    this.maxHeight = maxHeight || width;

    this.zoomByWidth();
    this.zoomByHeight();
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set width(w) {
    this._width = w;
  }

  set height(h) {
    this._height = h;
  }

  setZoomByScale(scale) {
    if (typeof scale !== 'number') throw new Error('scale must be a number');
    this.width = this.width * scale;
    this.height = this.height * scale;
  }

  setMaxWidthAndHeight() {
    this.width = this.maxWidth;
    this.height = this.maxHeight;
  }

  zoomByWidth(width = this.maxWidth) {
    if (!width) throw new Error('width must be nonzero numbers');
    const scale = width / this.width;
    this.height = Math.floor(this.height * scale);
    if (this.maxHeight < this.height) {
      this.height = this.maxHeight;
    }
  }

  zoomByHeight(height = this.maxHeight) {
    if (!height) throw new Error('height must be nonzero numbers');
    const scale = height / this.height;
    this.width = Math.floor(this.width * scale);
    if (this.maxWidth < this.width) {
      this.width = this.maxWidth;
    }
  }
}
