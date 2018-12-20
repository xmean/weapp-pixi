import PIXI from "pixi.js";

import View from "./view";
import ViewError from "./viewerror";

export default class Dialog extends View {
  constructor(style, manager, contentView) {
    super(style);

    this.manager = manager;
    this.pageWidth = this.manager.width;
    this.pageHeight = this.manager.height;

    if (!(contentView instanceof View)) {
      throw new ViewError(contentView.constructor.name + " should be descendents of View");
    } 
    this.contentView = contentView;

    this.modal = false;

    this.render();
  }

  render() {
    this.removeChildren();

    this._renderBackdrop();
    this._renderContentView();

    this._layout();
  }

  _renderBackdrop() {
    let fillColor = 0;
    let fillAlpha = 0;
    if (typeof this.style.backdropStyle != 'undefined') {
      fillColor = this.style.backdropStyle.fillColor;
      fillAlpha = this.style.backdropStyle.fillAlpha;
    }

    this.backdropView = new PIXI.Graphics();
    this.backdropView.beginFill(fillColor, fillAlpha);
    this.backdropView.drawRect(0, 0, this.pageWidth, this.pageHeight);
    this.backdropView.endFill();

    this.backdropView.interactive = true;
    this.backdropView.hitArea = new PIXI.Rectangle(0, 0, this.pageWidth, this.pageHeight);

    this.addChild(this.backdropView);

    this.backdropView.tap = (event) => {
      if(!this.modal) {
        this.close();
      }
    }
  }

  _renderContentView() {
    this.contentView.interactive = true;
    this.addChild(this.contentView);
  }

  _layout() {
    this._updateLayoutParameters();
    this._adjustAlignParameters();

    this.contentView.x = this.alignOffsetX + this.padding.left + this.contentView.margin.left;
    this.contentView.y = this.alignOffsetY + this.padding.top + this.contentView.margin.top;
  }

  _updateLayoutParameters() {
    this.viewWidth = this.contentView.layoutWidth;
    this.viewHeight = this.contentView.layoutHeight;

    this.layoutWidth = this.pageWidth;
    this.layoutHeight = this.pageHeight;

    this.hitArea = new PIXI.Rectangle(0, 0, this.layoutWidth, this.layoutHeight);
  }

  show() {
    if(typeof this.manager.currentPage != 'undefined') {
      this.manager.currentPage.addChild(this);
    }
  }

  showModal() {
    this.show();
    this.modal = true;
  }

  close() {
    if(typeof this.parent != 'undefined') {
      this.parent.removeChild(this);
    }
  }
}