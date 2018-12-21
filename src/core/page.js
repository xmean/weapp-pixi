import SYSTEM from "./system";
import * as PIXI from "pixi.js";

export default class Page extends PIXI.Container {
  constructor() {
    super();

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

  update() {
    
  }
}