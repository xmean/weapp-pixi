import View from "./view";
import ViewError from "./viewerror";

export default class ViewGroup extends View {
  setArgs() {
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

    this._render();
  }

  addChildViews(...views) {
    for (const view of views) {
      this.validateView(view);
      this.views.push(view);
    }

    this._render();
  }

  addChildViewList(viewList) {
    for (const view of viewList) {
      this.validateView(view);
      this.views.push(view);
    }
    
    this._render();
  }

  update() {
    for (const view of this.childViews) {
      view.update();
    }
  }
}