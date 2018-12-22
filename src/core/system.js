import * as PIXI from "pixi.js";

class System {
  constructor() {
    this.canvas = canvas;

    let systemInfo = wx.getSystemInfoSync();
    this.resolution = systemInfo.pixelRatio;
    this.windowWidth = systemInfo.windowWidth;
    this.windowHeight = systemInfo.windowHeight;

    this.width = this.windowWidth * this.resolution;
    this.height = this.windowHeight * this.resolution;
  }

  px(v) {
    if(typeof v === 'number') {
      return parseInt(v);
    }

    if(typeof v === 'string') {
      let m = v.match(/^([0-9]+)$/);
      if(m) {
        return parseInt(m[1]);
      }

      m = v.match(/^([0-9]+)px$/);

      if(m) {
        return parseInt(m[1]);
      }

      m = v.match(/^([0-9]+)dp$/);
      if(m) {
        return parseInt(m[1]) * this.resolution;
      }
    }

    throw new Error('`value` should be `px` or `dp`');
  }

  dp(v) {
    return v * this.resolution;
  }

  resId(id) {
    if(typeof id != 'string') {
      throw new Error('`id` should be string texture id');
    }

    let parts = id.split('.');
    let base = parts.slice(0, -1).join('.');
    let ext = parts.slice(-1);
    for (let i = Math.ceil(this.resolution); i >= 2; i--) {
      let prefix = '@' + Math.ceil(i) + 'x';
      let resId = base + prefix + '.' + ext;

      if (!(resId in PIXI.utils.TextureCache)) {
        continue;
      }

      return resId;
    }

    return id;
  }

  createOffScreenCanvas() {
    return wx.createCanvas();
  }
}

export default (new System);