import * as PIXI from "pixi.js";

import View from "./view";

export default class TextView extends View {
  parseArgs(args) {
    this.text = args[0];
  }

  onInit() {

  }

  _renderText() {
    let textStyle = this.style['textStyle' + this.selector];
    
    this.textView = new PIXI.Text(this.text, textStyle);
    this._setProperties(this.textView, textStyle, 'alpha');

    this.addChild(this.textView);
  }

  _renderIcons() {
    this._renderIcon("Top");
    this._renderIcon("Left");
    this._renderIcon('Bottom');
    this._renderIcon('Right');
  }

  _renderIcon(id) {
    let iconStyleId = 'icon' + id;
    let iconViewId = 'iconView' + id;

    // init parameters

    this[iconViewId + "Width"] = 0;
    this[iconViewId + "Height"] = 0;
    this[iconViewId + "Padding"] = 0;

    // build icon

    let iconStyleSelector = iconStyleId + this.state;
    let iconStyle = this.style[iconStyleSelector];
    if (typeof iconStyle != 'undefined') {
      this[iconViewId] = new PIXI.Sprite(PIXI.Texture.fromFrame(iconStyle.id));
      this._setProperties(this[iconViewId], iconStyle, 'width', 'height', 'tint', 'alpha', 'padding');

      this[iconViewId + "Width"] = this[iconViewId].width;
      this[iconViewId + "Height"] = this[iconViewId].height;
      this[iconViewId + "Padding"] = this[iconViewId].padding;

      this.addChild(this[iconViewId]);
    }
  }

  onRender() {
    this.removeChildren();
    this._renderText();
    this._renderIcons();
  }

  onMeasure() {
    const viewWidth = this.padding.left + 
      (typeof this.iconViewLeft != 'undefined' ? (this.iconViewLeftWidth + this.iconViewLeftPadding) : 0) + 
      this.textView.width +
      (typeof this.iconViewRight != 'undefined' ? (this.iconViewRightPadding + this.iconViewRightWidth) : 0) + 
      this.padding.right;
    const viewHeight = this.padding.top + 
      (typeof this.iconViewTop != 'undefined' ? (this.iconViewTopHeight + this.iconViewTopPadding) : 0) +
      this.textView.height + 
      (typeof this.iconViewBottom != 'undefined' ? (this.iconViewBottomPadding + this.iconViewBottomHeight) : 0) + 
      this.padding.bottom;
    
    return [viewWidth, viewHeight];
  }

  onLayout() {
    let x = this.alignOffsetX + this.padding.left;
    let y = this.alignOffsetY + this.padding.top + (typeof this.iconViewTop != 'undefined' ? (this.iconViewTopHeight + this.iconViewTopPadding) : 0);
    let height = Math.max(this.textView.height, this.iconViewLeftHeight, this.iconViewRightHeight);

    if (typeof this.iconViewLeft != 'undefined') {
      this.iconViewLeft.x = x;
      this.iconViewLeft.y = y + (height - this.iconViewLeft.height) / 2;
      x += (this.iconViewLeftWidth + this.iconViewLeftPadding);
    }

    this.textView.x = x;
    this.textView.y = y + (height - this.textView.height) / 2;
    x += (this.textView.width);

    if(typeof this.iconViewRight != 'undefined') {
      this.iconViewRight.x = x + this.iconViewRightPadding;
      this.iconViewRight.y = y + (height - this.iconViewRight.height) / 2;
    }

    if(typeof this.iconViewTop != 'undefined') {
      this.iconViewTop.x = this.textView.x + (this.textView.width - this.iconViewTopWidth) / 2;
      this.iconViewTop.y = this.alignOffsetY + this.padding.top; 
    }

    if (typeof this.iconViewBottom != 'undefined') {
      this.iconViewBottom.x = this.textView.x + (this.textView.width - this.iconViewBottomWidth) / 2;
      this.iconViewBottom.y = y + height + this.iconViewBottomPadding;
    }
  }

  setText(text) {
    if (this.text != text) {
      this.text = text;
      
      this._render();
    }
  }
}
