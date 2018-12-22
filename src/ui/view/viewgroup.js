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

  update() {
    for (const view of this.childViews) {
      view.update();
    }
  }
}