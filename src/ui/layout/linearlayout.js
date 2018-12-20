import * as PIXI from "pixi.js";

import View from "../view/view";
import Layout from "./layout";

export default class LinearLayout extends Layout {
  static LAYOUT_VERTICAL = 0x00;
  static LAYOUT_HORIZONTAL = 0x01;

  constructor(style, direction) {
    super(style);

    this.direction = direction;
  }

  render() {
    this._layout();
    this._renderBackground();
  }

  _layout() {
    this._updateLayoutParameters();
    this._adjustAlignParameters();

    if(this.direction == LinearLayout.LAYOUT_HORIZONTAL) {
      this._layoutHorizontal();
    } else if(this.direction == LinearLayout.LAYOUT_VERTICAL) {
      this._layoutVertical();
    }
  }

  _updateLayoutParameters() {
    if(this.direction == LinearLayout.LAYOUT_VERTICAL) {
      let maxWidth = 0;
      let viewWidth = 0;
      let viewHeight = 0;
      for(let view of this.views) {
        viewWidth = view.margin.left + view.layoutWidth + view.margin.right;
        if(viewWidth > maxWidth) {
          maxWidth = viewWidth;
        }

        viewHeight += (view.margin.top + view.layoutHeight + view.margin.bottom);
      }
      this.viewWidth = this.padding.left + maxWidth + this.padding.right;
      this.viewHeight = this.padding.top + viewHeight + this.padding.bottom;
    } else if(this.direction == LinearLayout.LAYOUT_HORIZONTAL) {
      let maxHeight = 0;
      let viewWidth = 0;
      let viewHeight = 0;
      for(let view of this.views) {
        viewHeight = view.margin.top + view.layoutHeight + view.margin.bottom;
        if(viewHeight > maxHeight) {
          maxHeight = viewHeight;
        }

        viewWidth += (view.margin.left + view.layoutWidth + view.margin.right);
      }
      this.viewWidth = this.padding.left + viewWidth + this.padding.right;
      this.viewHeight = this.padding.top + viewHeight + this.padding.bottom;
    }

    if(this.layoutWidth == -1) {
      this.layoutWidth = this.viewWidth;
    } 

    if(this.layoutHeight == -1) {
      this.layoutHeight = this.viewHeight;
    }

    this.hitArea = new PIXI.Rectangle(0, 0, this.layoutWidth, this.layoutHeight);
  }

  _layoutVertical() {
    this.removeChildren();
    let x =  this.padding.left;
    let y =  this.padding.top;
    for (let view of this.views) {
      y += view.margin.top;
      
      if (this.align & View.ALIGN_LEFT) {
        x = this.padding.left + view.margin.right;
      }

      if (this.align & View.ALIGN_CENTER) {
        x = (this.layoutWidth - view.layoutWidth) / 2;
      }

      if (this.align & View.ALIGN_RIGHT) {
        x = this.layoutWidth - view.layoutWidth;
      }

      view.x = x;
      view.y = y;
      this.addChild(view);

      y += (view.layoutHeight + view.margin.bottom);
    }
  }

  _layoutHorizontal() {
    this.removeChildren();

    let x = this.padding.left;
    let y = this.padding.top;
    for (let view of this.views) {
      x += view.margin.left;

      if (this.algin & View.ALIGN_TOP) {
        y = this.padding.top + view.margin.top;
      }

      if (this.align & View.ALIGN_MIDDLE) {
        y = (this.layoutHeight - view.layoutHeight) / 2;
      }

      if (this.align & View.ALIGN_BOTTOM) {
        y = this.layoutHeight - view.layoutHeight;
      }

      view.x = x;
      view.y = y;
      this.addChild(view);

      x += (view.layoutWidth + view.margin.right);
    }
  }
} 