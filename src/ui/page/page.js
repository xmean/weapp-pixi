import SYSTEM from "../../core/system";
import View from "../view/view";

export default class Page extends View {
  constructor(style, id) {
    super(style);
    
    this.id = id;

    this.pageWidth = SYSTEM.width;
    this.pageHeight = SYSTEM.height;
    this.resolution = SYSTEM.resolution;
    this.renderer = SYSTEM.renderer;
    
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