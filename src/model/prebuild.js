import * as PIXI from 'pixi.js';
import SYSTEM from '../core/system';

export default class Prebuild extends PIXI.Container {
    constructor() {
      super();
  
      this.ticker = 0;

      if(typeof SYSTEM.renderer === 'undefined') {
        throw Error('`Prebuild` initialize error, SYSTEM is not initialized');
      }
    }
  
    generateTexture(resId) {
      this.render();
      PIXI.Texture.addToCache(SYSTEM.renderer.generateTexture(this), resId);
    }
  
    generateAnimationFrames(resId, frames) {
      this.ticker = 0;
      this.update();
      let frameId = resId;
      for (let i = 0; i < frames; i++) {
        this.update();
  
        frameId = resId + '$$' + i;
        PIXI.Texture.addToCache(this.renderer.generateTexture(this), frameId);
      }
    }

    render() {
    }
    
    update() { 
    }
  }