import View from "../view/view";

export default class Page extends View {
  constructor(style, manager) {
    super(style);

    this.manager = manager;
    this.pageWidth = this.manager.width;
    this.pageHeight = this.manager.height;

    this.paused = true;
  }

  pause() {
    this.paused = true;
  }

  resume() {
    this.paused = false;
  }

  isPaused() {
    return this.paused;
  }
}