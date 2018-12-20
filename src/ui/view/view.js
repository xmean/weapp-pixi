import * as PIXI from 'pixi.js';

export default class View extends PIXI.Container {
  static ALIGN_LEFT = 0x00;
  static ALIGN_CENTER = 0x01;
  static ALIGN_RIGHT = 0x02;
  static ALIGN_TOP = 0x04;
  static ALIGN_MIDDLE = 0x08;
  static ALIGN_BOTTOM = 0x10;

  constructor(style) {
    super();
  
    this.margin = {top: 0, left: 0, bottom: 0, right: 0};
    this.padding = {top: 0, left: 0, bottom: 0, right: 0};
    
    this.layoutWidth = -1;
    this.layoutHeight = -1;

    this.align = View.ALIGN_TOP | View.ALIGN_LEFT;
    this.state = "";

    this.style = style;
    this._setProperties(this, this.style, 'margin', 'padding', 'layoutWidth', 'layoutHeight', 'align', 'state');

    this.viewWidth = 0;
    this.viewHeight = 0;
    this.alignOffsetX = 0;
    this.alignOffsetY = 0;
  }

  setMargin(top, left, bottom, right) {
    this.margin.top = top;
    this.margin.left = left;
    this.margin.bottom = bottom;
    this.margin.right = right;
  }

  setMarginBottom(bottom) {
    this.margin.bottom = bottom;
  }

  _adjustAlignParameters() {
    if (this.align & View.ALIGN_LEFT) {
      this.alignOffsetX = 0;
    }

    if (this.align & View.ALIGN_CENTER) {
      this.alignOffsetX = (this.layoutWidth - this.viewWidth) / 2;
    }

    if (this.align & View.ALIGN_RIGHT) {
      this.alignOffsetX = this.layoutWidth - this.viewWidth;
    }

    if (this.algin & View.ALIGN_TOP) {
      this.alignOffsetY = 0;
    }

    if (this.align & View.ALIGN_MIDDLE) {
      this.alignOffsetY = (this.layoutHeight - this.viewHeight) / 2;
    }

    if (this.align & View.ALIGN_BOTTOM) {
      this.alignOffsetY = this.layoutHeight - this.viewHeight;
    }
  }

  _renderBackground() {
    let backgroundStyle = this.style['backgroundStyle' + this.state];
    if (typeof backgroundStyle == 'undefined') {
      delete this.backgroundView;
      return;
    }

    this.removeChild(this.backgroundView);
    delete this.backgroundView;
    
    if (backgroundStyle.backgroundType == 'circle') {
      let r = Math.min(this.layoutWidth, this.layoutHeight) / 2;

      this.backgroundView = new PIXI.Graphics();
      this.backgroundView.lineStyle(backgroundStyle.borderWidth, backgroundStyle.borderColor, backgroundStyle.borderAlpha);
      this.backgroundView.beginFill(backgroundStyle.fillColor, backgroundStyle.fillAlpha);
      this.backgroundView.drawCircle(r, r, r);
      this.backgroundView.endFill();
      this.addChildAt(this.backgroundView, 0);
    } else if(backgroundStyle.backgroundType == 'roundedRect') {
      let cornerRadius = backgroundStyle.cornerRadius;
      if(cornerRadius > 0 && cornerRadius < 1) {
        cornerRadius = cornerRadius * Math.min(this.layoutWidth, this.layoutHeight);
      }

      this.backgroundView = new PIXI.Graphics();
      this.backgroundView.lineStyle(backgroundStyle.borderWidth, backgroundStyle.borderColor, backgroundStyle.borderAlpha);
      this.backgroundView.beginFill(backgroundStyle.fillColor, backgroundStyle.fillAlpha);
      this.backgroundView.drawRoundedRect(0, 0, this.layoutWidth, this.layoutHeight, cornerRadius);
      this.backgroundView.endFill();
      this.addChildAt(this.backgroundView, 0);
    } else if(backgroundStyle.backgroundType == 'rect') {
      this.backgroundView = new PIXI.Graphics();
      this.backgroundView.lineStyle(backgroundStyle.borderWidth, backgroundStyle.borderColor, backgroundStyle.borderAlpha);
      this.backgroundView.beginFill(backgroundStyle.fillColor, backgroundStyle.fillAlpha);
      this.backgroundView.drawRect(0, 0, this.layoutWidth, this.layoutHeight);
      this.backgroundView.endFill();
      this.addChildAt(this.backgroundView, 0);
    }
  }

  _setProperties(targetObj, sourceObj, ...properties) {
    if(typeof sourceObj == 'undefined' || typeof targetObj == 'undefined') {
      return;
    }

    for(let property of properties) {
      if(typeof sourceObj[property] != 'undefined') {
        targetObj[property] = sourceObj[property];
      }
    }
  }

  update() {
    
  }

  setOnClick(onClick) {
    if(typeof onClick == 'function') {
      this.interactive = true;
      this.onClick = onClick;
      this.tap = (event) => {
        this.onClick(event);
      }
    }
  }

  setState(state) {
    if (this.state != state) {
      this.state = state;

      this.render();
    }
  }
}