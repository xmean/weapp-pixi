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
      antialias: true,
      forceWebGL: false,
      fps: 60,
      lag: 240
    }

    if (typeof options === 'object') {
      Object.assign(rendererOptions, options);
    }

    if(rendererOptions.forceWebGL) {
      this.renderer = new PIXI.WebGLRenderer(rendererOptions);
    } else {
      this.renderer = PIXI.autoDetectRenderer(rendererOptions);
    }
    SYSTEM.renderer = this.renderer;
    this.fps = rendererOptions.fps;
    this.frameTime = 1000 / this.fps;
    this.lag = rendererOptions.lag;

    // pages

    this.pages = [];
    this.backStack = [];
  }

  loop() {
    if (!(this.currentPage instanceof Page) || this.currentPage.isPaused()) {
      return;
    }
    const currentFrameTime = Date.now();
    this.deltaTime += (currentFrameTime - this.lastFrameTime);
    this.lastFrameTime = currentFrameTime;	
    
    let updateCount = 0;
    while(this.deltaTime >= this.frameTime) {
      this.currentPage.update(this.frameTime);
      this.deltaTime -= this.frameTime;

      updateCount++;
      if(updateCount >= this.lag) {
        this.deltaTime = 0;
        if(typeof this.onLag != 'undefined') {
          this.onLag(updateCount);
        }
        break;
      }
    }

    this.renderer.render(this.currentPage);
    requestAnimationFrame(() => this.loop());
  }

  start() {
    this.lastFrameTime = Date.now();
    this.deltaTime = 0;
    requestAnimationFrame(() => this.loop());
  }

  addPage(id, page) {
    if(!(page instanceof Page)) {
      throw new Error("addPage: the 2nd param should be a `Page` object");
    }

    if (typeof this.pages[id] === 'object') {
      this.pages[id].destroy();
    }

    page.context = this;
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
        this.backStack.push(id);
        this.currentPage.resume();
      });
    } else {
      this.currentPage = currentPage;
      this.backStack.push(id);
      this.currentPage.resume();
    }
  }

  getPage(id) {
    return this.pages[id];
  }

  renderPage(page) {
    if(page instanceof Page) {
      this.renderer.render(page);
    }
  }

  back() {
    this.backStack.pop();
    const id = this.backStack.pop();
    if(typeof id != 'undefined') {
      this.setPage(id);
    }
  }

  hasPage(id) {
    return (typeof id === 'string') && (id in this.pages);
  }
}