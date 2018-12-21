import SYSTEM from "../../core/system";
import * as PIXI from 'pixi.js';

export default class View extends PIXI.Container {
  static ALIGN_LEFT = 0x00;
  static ALIGN_CENTER = 0x01;
  static ALIGN_RIGHT = 0x02;
  static ALIGN_TOP = 0x04;
  static ALIGN_MIDDLE = 0x08;
  static ALIGN_BOTTOM = 0x10;
  static ALIGN_MAP = {
    'left' : View.ALIGN_LEFT,
    'center': View.ALIGN_CENTER,
    'right': View.ALIGN_RIGHT,
    'top': View.ALIGN_TOP,
    'middle': View.ALIGN_MIDDLE,
    'bottom': View.ALIGN_BOTTOM
  };

  constructor(attrs, ...args) {
    super();
    
    this.margin = {top: 0, left: 0, bottom: 0, right: 0};
    this.padding = {top: 0, left: 0, bottom: 0, right: 0};
    
    this.layoutWidth = -1;
    this.layoutHeight = -1;

    this.align = View.ALIGN_TOP | View.ALIGN_LEFT;
    this.selector = "";

    this.viewWidth = 0;
    this.viewHeight = 0;
    this.alignOffsetX = 0;
    this.alignOffsetY = 0;

    this.attrs = attrs;
    if(typeof this.parseAttrs === 'function') {
      this.parseAttrs(attrs);
    }
    
    if(typeof this.parseArgs === 'function') {
      this.parseArgs(args);
    }
    
    if(typeof this.onInit === 'function') {
      this.onInit();
    }
    
    this._render();
  }

  _parseAlign(align) {
    if(typeof align === 'string') {
      if(align.match(/^(left|center|right|top|middle|bottom)(\|(left|center|right|top|middle|bottom))*$/)) {
        const aligns = align.split('|');
        let al = 0;

        for(const a in aligns) {
          al |= View.ALIGN_MAP[a];
        }

        return al;
      } else {
        throw new Error('`align` should be one of the followings: left|center|right|top|middle|bottom');
      }
    } else if(typeof align === 'number') {
      return parseInt(align);
    }

    throw new Error('invalid `align` values');
  }

  _setSpacing(target, src) {
    if(typeof src != 'object') {
      throw new Error('value should be in `{top:?, left:?, bottom:?, right:?}` format');
    }

    target.top = SYSTEM.px(src.top);
    target.left = SYSTEM.px(src.left);
    target.bottom = SYSTEM.px(src.bottom);
    target.right = SYSTEM.px(src.right);
  }

  parseAttrs(attrs) {
    if(typeof attrs != 'object') {
      return;
    }

    if(typeof attrs.margin != 'undefined') {
      this._setSpacing(this.margin, attrs.margin);
    }

    if(typeof attrs.padding != 'undefined') {
      this._setSpacing(this.padding, attrs.padding);
    }

    if(typeof attrs.layoutWidth != 'undefined') {
      this.layoutWidth = SYSTEM.px(attrs.layoutWidth);
    }

    if(typeof attrs.layoutHeight != 'undefined') {
      this.layoutHeight = SYSTEM.px(attrs.layoutHeight);
    }

    if(typeof attrs.align != 'undefined') {
      this.align = this._parseAlign(attrs.algin);
    }

    if(typeof attrs.selector != 'undefined') {
      this.selector = attrs.selector;
    }
  }

  _align() {
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

  _measure() {
    [this.viewWidth, this.viewHeight] = this.onMeasure();

    if(this.layoutWidth == -1) {
      this.layoutWidth = this.viewWidth;
    } 

    if(this.layoutHeight == -1) {
      this.layoutHeight = this.viewHeight;
    }

    this.hitArea = new PIXI.Rectangle(0, 0, this.layoutWidth, this.layoutHeight);
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

  _render() {
    this.onRender();
    this._measure();
    this._align();
    this.onLayout();
    this._renderBackground();
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

  setSelector(selector) {
    if (this.selector != selector) {
      this.selector = selector;

      this.render();
    }
  }
}