import * as PIXI from "pixi.js";
import Tween from "../../tween/tween";

import View from "../view/view";

export default class ScrollView extends View {
  onParseArgs(args) {
    this.view = args[0];
    this.viewportWidth = args[1];
    this.viewportHeight = args[2];
  }

  onInit() {
    this.addChild(this.view);

    this.scrollBounds = { left: 0, right: 0, top: 0, bottom: 0 };

    this.viewportMask = new PIXI.Graphics();
    this.addChild(this.viewportMask);
    this._setViewportSize(this.viewportWidth, this.viewportHeight);

    this.horizontalScrollEnabled = false;
    this.verticalScrollEnabled = false;

    this._setupScroll();

    this.flingTweenX = {
      enabled : false,
      velocity: 0,
      resistance: 0.5,
      onFling: (v) => {
        this.view.x += v;
        this._reboundX();
      }
    };
    this.flingTweenY = {
      enabled : false,
      velocity: 0,
      resistance: 0.5,
      onFling: (v) => {
        this.view.y += v;
        this._reboundY();
      }
    };
    this.reboundTweenX = new Tween({ easing: "easeOutQuad", repeat: false, duration: 30 }, this.view.x, this.view.x, (v) => {
      this.view.x = v;
    });
    this.reboundTweenY = new Tween({ easing: "easeOutQuad", repeat: false, duration: 30 }, this.view.y, this.view.y, (v) => {
      this.view.y = v;
    });
  }

  onMeasure() {
    return [this.viewportWidth, this.viewportHeight];
  }

  _setViewportSize(width, height) {
    if (typeof width == 'number' && width > 0) {
      this.viewportWidth = width;
    } else {
      this.viewportWidth = this.view.layoutWidth;
    }

    if (typeof height == 'number' && height > 0) {
      this.viewportHeight = height;
    } else {
      this.viewportHeight = this.view.layoutHeight;
    }

    this._updateViewport();
    this._updateScrollBounds();
    this._updateLayoutParameters();
    this.hitArea = new PIXI.Rectangle(0, 0, this.viewportWidth, this.viewportHeight);
  }

  _updateViewport() {
    this.viewportMask.clear();
    this.viewportMask.lineStyle(0);
    this.viewportMask.beginFill(0xFFFFFF, 1);
    this.viewportMask.drawRect(0, 0, this.viewportWidth, this.viewportHeight);
    this.viewportMask.endFill();
    this.mask = this.viewportMask;
  }

  _updateScrollBounds() {
    this.scrollBounds.left = -(this.view.layoutWidth - this.viewportWidth);
    this.scrollBounds.right = 0;
    this.scrollBounds.top = -(this.view.layoutHeight - this.viewportHeight);
    this.scrollBounds.bottom = 0;
  }

  _updateLayoutParameters() {
    this.layoutWidth = this.padding.left + this.viewportWidth + this.padding.right;
    this.layoutHeight = this.padding.top + this.viewportHeight + this.padding.bottom;
  }

  enableHorizontalScroll() {
    this.horizontalScrollEnabled = true;
    this.interactive = true;
  }

  enableVerticalScroll() {
    this.verticalScrollEnabled = true;
    this.interactive = true;
  }

  _setupScroll() {
    this.dragging = false;
    this.dragPoint = {x: 0, y: 0};

    this.pointerdown = this._onDragStart;
    this.pointermove = this._onDragMove;
    this.pointerup = this._onDragEnd;
    this.pointerupoutside = this._onDragEnd;
  }

  _onDragStart(event) {
    if (!this.horizontalScrollEnabled && !this.verticalScrollEnabled) {
      return;
    }

    this.dragging = true;
    this.dragPoint.x = event.data.global.x
    this.dragPoint.y = event.data.global.y;
    
    this.flingTweenX.velocity = 0;
    this.flingTweenX.enabled = false;
    this.flingTweenY.velocity = 0;
    this.flingTweenY.enabled = false;
    this.reboundTweenX.enabled = false;
    this.reboundTweenY.enabled = false;
  }

  _onDragMove(event) {
    if (!this.horizontalScrollEnabled && !this.verticalScrollEnabled) {
      return;
    }
    
    if (this.dragging) {
      let deltaX = event.data.global.x - this.dragPoint.x;
      let deltaY = event.data.global.y - this.dragPoint.y;

      if (this.horizontalScrollEnabled) {
        this.view.x += deltaX;
        this.flingTweenX.velocity = deltaX;
      }

      if (this.verticalScrollEnabled) {
        this.view.y += deltaY;
        this.flingTweenY.velocity = deltaY;
      }

      this.dragPoint.x = event.data.global.x
      this.dragPoint.y = event.data.global.y;
    }
  }

  _onDragEnd() {
    if (!this.horizontalScrollEnabled && !this.verticalScrollEnabled) {
      return;
    }

    if (this.horizontalScrollEnabled) {
      if(!this._reboundX()) {
        this.flingTweenX.enabled = true;
      }
    }

    if (this.verticalScrollEnabled) {
      if(!this._reboundY()) {
        this.flingTweenY.enabled = true;
      }
    }

    this.dragging = false;
  }

  _fling(tween) {
    if(tween.enabled) {
      let sign = Math.sign(tween.velocity);
      tween.velocity -= sign * tween.resistance;
      if (sign != Math.sign(tween.velocity)) {
        tween.enabled = false;
        return;
      }
      if(typeof tween.onFling == "function") {
        tween.onFling(tween.velocity);
      }
    }
  }

  _reboundX() {
    if (this.view.x < this.scrollBounds.left) {
      this.flingTweenX.enabled = false;
      this.reboundTweenX.setRange(this.view.x, this.scrollBounds.left);
      this.reboundTweenX.enabled = true;

      return true;
    } else if (this.view.x > this.scrollBounds.right) {
      this.flingTweenX.enabled = false;
      this.reboundTweenX.setRange(this.view.x, this.scrollBounds.right);
      this.reboundTweenX.enabled = true;

      return true;
    }

    return false;
  }

  _reboundY() {
    if (this.view.y < this.scrollBounds.top) {
      this.flingTweenY.enabled = false;
      this.reboundTweenY.setRange(this.view.y, this.scrollBounds.top);
      this.reboundTweenY.enabled = true;

      return true;
    } else if (this.view.y > this.scrollBounds.bottom) {
      this.flingTweenY.enabled = false;
      this.reboundTweenY.setRange(this.view.y, this.scrollBounds.bottom);
      this.reboundTweenY.enabled = true;

      return true;
    }

    return false;
  }

  update() {
    this.view.update();
    
    this._fling(this.flingTweenX);
    this._fling(this.flingTweenY);
    this.reboundTweenX.update();
    this.reboundTweenY.update();
  }
}