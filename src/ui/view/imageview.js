import * as PIXI from "pixi.js";
import SYSTEM from '../../core/system';

import View from "./view";

export default class ImageView extends View {
  onParseArgs(args) {
    if(typeof args[0] != 'undefined') {
      this.resId = SYSTEM.resId(args[0]);
    }
  }

  onParseAttrs(attrs) {
    super._setAttrs(this, attrs, View.ATTR_TEXTURE, this.selector, 'imageStyle');
  }

  onInit() {
    if(typeof this.resId != 'undefined') {
      this.imageView = new PIXI.Sprite(PIXI.Texture.from(this.resId));
      this.addChild(this.imageView);
    }
  }

  onRender() {
    if(typeof this.imageStyle.resId != 'undefined' && this.resId != this.imageStyle.resId) {
      this.resId = this.imageStyle.resId;
      
      if(typeof this.imageView === 'undefined') {
        this.imageView = new PIXI.Sprite(PIXI.Texture.from(this.resId));
        this.addChild(this.imageView);
      } else {
        this.imageView.texture = PIXI.Texture.from(this.resId);
      }
    }

    super._setAttrs(this.imageView, this.imageStyle, View.ATTR_SIZE, '', 'padding');
    super._setAttrs(this.imageView, this.imageStyle, View.ATTR_VALUE, '', 'tint', 'alpha');
    super._setImageSize(this.imageView, this.imageStyle);
  }

  onMeasure() {
    const viewWidth = this.padding.left + this.imageView.width + this.padding.right;
    const viewHeight = this.padding.top + this.imageView.height + this.padding.bottom;

    return [viewWidth, viewHeight];
  }

  onLayout() { 
    this.imageView.x = this.alignOffsetX;
    this.imageView.y = this.alignOffsetY;
  }
}