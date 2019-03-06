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

    const r = Math.ceil(this.resolution);
    if(r <= 1) {
      return id;
    }

    const parts = id.split('.');
    const base = parts.slice(0, -1).join('.');
    const ext = parts.slice(-1);
    
    const resId = base + '@' + r + 'x' + '.' + ext;
    if(resId in PIXI.utils.TextureCache) {
      return resId;
    }

    // find the nearest resultion resources

    for(let i = 1; i <= r - 2; i++) {
      // search for higher resolution

      let hResId = base + '@' + (r + i) + 'x' + '.' + ext;
      if(hResId in PIXI.utils.TextureCache) {
        return hResId;
      }
      
      // search for lower resolution

      let lResId = base + '@' + (r - i) + 'x' + '.' + ext;
      if(lResId in PIXI.utils.TextureCache) {
        return lResId;
      }
    }

    return id;
  }

  createCanvas() {
    return wx.createCanvas();
  }
}

export default (new System);