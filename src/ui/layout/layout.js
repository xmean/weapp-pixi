import View from "../view/view";
import ViewError from "../view/viewerror";

export default class Layout extends View {
  constructor(style) {
    super(style);

    this.views = [];
  }

  validateView(view) {
    if (!(view instanceof View)) {
      throw new ViewError(view.constructor.name + " should be descendents of View");
    } 
  }

  addView(view) {
    this.validateView(view);
    this.views.push(view);

    this.render();
  }

  addViews(...views) {
    for (let view of views) {
      this.validateView(view);
      this.views.push(view);
    }

    this.render();
  }

  addViewList(viewList) {
    for (let view of viewList) {
      this.validateView(view);
      this.views.push(view);
    }
    
    this.render();
  }

  update() {
    for (let view of this.views) {
      view.update();
    }
  }
}