import SYSTEM from "./system";
import * as PIXI from "pixi.js";

export default class WPX {
  constructor(options) {
    this.width = SYSTEM.windowWidth;
    this.height = SYSTEM.windowHeight;
    this.view = SYSTEM.canvas;
    this.resolution = SYSTEM.resolution;

    // renderer

    let rendererOptions = {
      width: this.width,
      height: this.height,
      view: this.view,
      resolution: this.resolution,
      antialias: true
    }

    if (typeof options === 'object') {
      Object.assign(rendererOptions, options);
    }
    this.renderer = new PIXI.WebGLRenderer(rendererOptions);

    // pages

    this.pages = [];
  }

  loop() {
    if (typeof this.currentPage === 'undefined' || this.currentPage.isPaused()) {
      return;
    }
    this.currentPage.update();
    this.renderer.render(this.currentPage);

    requestAnimationFrame(() => { this.loop(); });
  }

  start() {
    this.loop();
  }

  addPage(id, page) {
    if (typeof this.pages[id] === 'object') {
      this.pages[id].destroy();
    }

    this.pages[id] = page;
  }

  setCurrentPage(id) {
    let page = this.pages[id];
    if (page == this.currentPage) {
      return;
    }

    if (typeof this.currentPage === 'object') {
      this.currentPage.pause();
    }

    this.currentPage = page;
    this.currentId = id;

    this.currentPage.resume();
  }
}