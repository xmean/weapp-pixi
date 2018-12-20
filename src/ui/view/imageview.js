import * as PIXI from "pixi.js";

import View from "./view";

export default class ImageView extends View {
  constructor(style, resId) {
    super(style);

    this.resId = resId;

    this.render();
  }

  render() {
    this.removeChildren();

    this._renderImage();

    this._layout();
    this._renderBackground();
  }

  _renderImage() {
    this.imageView = new PIXI.Sprite(PIXI.Texture.fromFrame(this.resId));

    let imageStyle = this.style['imageStyle' + this.state];
    this._setProperties(this.imageView, imageStyle, 'width', 'height', 'tint', 'alpha');
    this.addChild(this.imageView);
  }

  _layout() {
    this._updateLayoutParameters();
    this._adjustAlignParameters();

    let x = this.alignOffsetX + this.padding.left;
    let y = this.alignOffsetY + this.padding.top;

    this.imageView.x = x;
    this.imageView.y = y;
  }

  _updateLayoutParameters() {
    this.viewWidth = this.padding.left + this.imageView.width + this.padding.right;
    this.viewHeight = this.padding.top + this.imageView.height +  this.padding.bottom;

    if (this.layoutWidth == -1) {
      this.layoutWidth = this.viewWidth;
    }

    if (this.layoutHeight == -1) {
      this.layoutHeight = this.viewHeight;
    }

    this.hitArea = new PIXI.Rectangle(0, 0, this.layoutWidth, this.layoutHeight);
  }
}