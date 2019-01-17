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
    const contentWidth = this.layoutWidth - this.padding.left - this.padding.right;
    const contentHeight = this.layoutHeight - this.padding.top - this.padding.bottom;

    let alignOffsetX = this.padding.left;
    let alignOffsetY = this.padding.top;
    
    if (this.align & View.ALIGN_LEFT) {
      alignOffsetX = this.padding.left;
    }

    if (this.align & View.ALIGN_CENTER) {
      alignOffsetX = this.padding.left + (contentWidth - view.layoutWidth) / 2;
    }

    if (this.align & View.ALIGN_RIGHT) {
      alignOffsetX = this.layoutWidth - view.layoutWidth - this.padding.right;
    }

    if (this.align & View.ALIGN_TOP) {
      alignOffsetY = this.padding.top;
    }

    if (this.align & View.ALIGN_MIDDLE) {
      alignOffsetY = this.padding.top + (contentHeight - view.layoutHeight) / 2;
    }

    if (this.align & View.ALIGN_BOTTOM) {
      alignOffsetY = this.layoutHeight - view.layoutHeight - this.padding.bottom;
    }

    return [alignOffsetX, alignOffsetY];
  }

  update() {
    for (const view of this.childViews) {
      view.update();
    }
  }
}