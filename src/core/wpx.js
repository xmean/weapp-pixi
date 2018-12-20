import SYSTEM from "./system";
import * as PIXI from "pixi.js";

export default class WPX {
  constructor(options) {
    this.width = SYSTEM.width;
    this.height = SYSTEM.height;
    this.resolution = SYSTEM.resolution;
    this.view = SYSTEM.canvas;
    
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
    this.renderer = PIXI.autoDetectRenderer(rendererOptions);
    SYSTEM.renderer = this.renderer;

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

  addPage(page) {
    if(typeof page != 'object') {
      throw new Error("`page` should be a `Page` object");
    }

    if (typeof this.pages[page.id] === 'object') {
      this.pages[page.id].destroy();
    }

    this.pages[page.id] = page;
  }

  setPage(page) {
    let id = "";

    if(typeof page === 'object') {
      id = page.id;
    } else if(typeof page === 'string') {
      id = page;
    } else {
      throw new Error("`page` should be a `Page` object or a `string` id");
    }

    let currentPage = this.pages[id];
    if (currentPage == this.currentPage) {
      return;
    }

    if (typeof this.currentPage === 'object') {
      this.currentPage.pause();
    }

    this.currentPage = currentPage;
    this.currentPage.resume();
  }
}