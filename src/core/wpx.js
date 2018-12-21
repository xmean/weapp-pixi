import SYSTEM from "./system";
import * as PIXI from "pixi.js";

import Page from "./page";

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
    if (!(this.currentPage instanceof Page) || this.currentPage.isPaused()) {
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
    if(!(page instanceof Page)) {
      throw new Error("addPage: `page` should be a `Page` object");
    }

    if (typeof this.pages[id] === 'object') {
      this.pages[id].destroy();
    }

    this.pages[id] = page;
  }

  setPage(id, onPageTransition) {
    let currentPage = this.pages[id];

    if(!(currentPage instanceof Page)) {
      throw new Error("setPage: `page` should be a `Page` object or a `string` id");
    }

    if (currentPage === this.currentPage) {
      return;
    }

    if(this.currentPage instanceof Page) {
      this.currentPage.pause();
    }
    
    if(typeof onPageTransition === 'function') {
      onPageTransition(this.currentPage, currentPage, () => {
        this.currentPage = currentPage;
        this.currentPage.resume();
      });
    } else {
      this.currentPage = currentPage;
      this.currentPage.resume();
    }
  }
}