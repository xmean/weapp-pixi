import * as PIXI from "pixi.js";

import View from "./view";

export default class TextView extends View {
  onParseAttrs(attrs) {
    super._setAttrs(this, attrs, View.ATTR_TEXTSTYLE, this.selector, 'textStyle');
    super._setAttrs(this, attrs, View.ATTR_TEXTURE, this.selector, 'iconTop');
    super._setAttrs(this, attrs, View.ATTR_TEXTURE, this.selector, 'iconLeft');
    super._setAttrs(this, attrs, View.ATTR_TEXTURE, this.selector, 'iconBottom');
    super._setAttrs(this, attrs, View.ATTR_TEXTURE, this.selector, 'iconRight');
  }

  onParseArgs(args) {
    this.text = args[0];
  }

  onInit() {
    this.textView = new PIXI.Text(this.text, this.textStyle);
    super._setAttrs(this.textView, this.textStyle, View.ATTR_VALUE, '', 'alpha');
    this.addChild(this.textView);
  }

  _renderText() {
    if(this.textView.text != this.text) {
      this.textView.text = this.text;
    }
    
    if(this.textView.style != this.textStyle) {
      this.textView.style = this.textStyle;
    }

    super._setAttrs(this.textView, this.textStyle, View.ATTR_VALUE, 'alpha');
  }

  _renderIcons() {
    ['Top', 'Left', 'Bottom', 'Right'].map(v => this._renderIcon(v));
  }

  _renderIcon(id) {
    const iconStyle = this['icon' + id];

    if(typeof iconStyle === 'undefined') {
      return;
    }

    const iconView = 'iconView' + id;

    if(this[iconView] instanceof PIXI.Sprite) {
      this.removeChild(this[iconView]);
      this[iconView].destroy();
    }

    this[iconView] = new PIXI.Sprite(PIXI.Texture.fromFrame(iconStyle.resId));
    super._setAttrs(this[iconView], iconStyle, View.ATTR_SIZE, '', 'width', 'height', 'padding');
    super._setAttrs(this[iconView], iconStyle, View.ATTR_VALUE, '', 'tint', 'alpha');

    this.addChild(this[iconView]);
  }

  onRender() {
    this._renderText();
    this._renderIcons();
  }

  onMeasure() {
    const viewWidth = this.padding.left + 
      (typeof this.iconViewLeft != 'undefined' ? (this.iconViewLeft.width + this.iconViewLeft.padding) : 0) + 
      this.textView.width +
      (typeof this.iconViewRight != 'undefined' ? (this.iconViewRight.padding + this.iconViewRight.width) : 0) + 
      this.padding.right;
    const viewHeight = this.padding.top + 
      (typeof this.iconViewTop != 'undefined' ? (this.iconViewTop.height + this.iconViewTop.padding) : 0) +
      this.textView.height + 
      (typeof this.iconViewBottom != 'undefined' ? (this.iconViewBottom.padding + this.iconViewBottom.height) : 0) + 
      this.padding.bottom;
    
    return [viewWidth, viewHeight];
  }

  onLayout() {
    let x = this.alignOffsetX + this.padding.left;
    let y = this.alignOffsetY + this.padding.top + (typeof this.iconViewTop != 'undefined' ? (this.iconViewTop.height + this.iconViewTop.padding) : 0);
    let height = Math.max(
      this.textView.height, 
      typeof this.iconViewLeft === 'undefined' ?  0 : this.iconViewLeft.height, 
      typeof this.iconViewRight === 'undefined' ? 0 : this.iconViewRight.height);

    if (typeof this.iconViewLeft != 'undefined') {
      this.iconViewLeft.x = x;
      this.iconViewLeft.y = y + (height - this.iconViewLeft.height) / 2;
      x += (this.iconViewLeft.width + this.iconViewLeft.padding);
    }

    this.textView.x = x;
    this.textView.y = y + (height - this.textView.height) / 2;
    x += (this.textView.width);

    if(typeof this.iconViewRight != 'undefined') {
      this.iconViewRight.x = x + this.iconViewRight.padding;
      this.iconViewRight.y = y + (height - this.iconViewRight.height) / 2;
    }

    if(typeof this.iconViewTop != 'undefined') {
      this.iconViewTop.x = this.textView.x + (this.textView.width - this.iconViewTop.width) / 2;
      this.iconViewTop.y = this.alignOffsetY + this.padding.top; 
    }

    if (typeof this.iconViewBottom != 'undefined') {
      this.iconViewBottom.x = this.textView.x + (this.textView.width - this.iconViewBottom.width) / 2;
      this.iconViewBottom.y = y + height + this.iconViewBottom.padding;
    }
  }

  setText(text) {
    if (this.text != text) {
      this.text = text;
      
      this._render();
    }
  }
}
