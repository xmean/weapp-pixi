import View from "./view";
import ViewError from "./viewerror";

export default class ViewGroup extends View {
  onInit() {
    this.childViews = [];
  }
  
  _validateView(view) {
    if (!(view instanceof View)) {
      throw new ViewError(view.constructor.name + " should be descendents of View");
    } 
  }

  addChildView(view) {
    this._validateView(view);

    this.childViews.push(view);
    this.addChild(view);

    this.invalidate();
  }

  addChildViews(...views) {
    for (const view of views) {
      this._validateView(view);

      this.childViews.push(view);
      this.addChild(view);
    }

    this.invalidate();
  }

  addChildViewList(viewList) {
    for (const view of viewList) {
      this._validateView(view);

      this.childViews.push(view);
      this.addChild(view);
    }
    
    this.invalidate();
  }

  getChildViewAlignParameter(view) {
    let alignOffsetX = 0;
    let alignOffsetY = 0;
    if (this.align & View.ALIGN_LEFT) {
      alignOffsetX = 0;
    }

    if (this.align & View.ALIGN_CENTER) {
      alignOffsetX = (this.layoutWidth - view.layoutWidth) / 2;
    }

    if (this.align & View.ALIGN_RIGHT) {
      alignOffsetX = this.layoutWidth - view.layoutWidth;
    }

    if (this.algin & View.ALIGN_TOP) {
      alignOffsetY = 0;
    }

    if (this.align & View.ALIGN_MIDDLE) {
      alignOffsetY = (this.layoutHeight - view.layoutHeight) / 2;
    }

    if (this.align & View.ALIGN_BOTTOM) {
      alignOffsetY = this.layoutHeight - view.layoutHeight;
    }

    return [alignOffsetX, alignOffsetY];
  }

  update() {
    for (const view of this.childViews) {
      view.update();
    }
  }
}