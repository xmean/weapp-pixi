import * as PIXI from 'pixi.js';
import SYSTEM from '../core/system';

export default class Prebuild extends PIXI.Container {
    constructor() {
      super();
  
      this.tick = 0;

      if(typeof SYSTEM.renderer === 'undefined') {
        throw Error('`Prebuild` initialize error, SYSTEM is not initialized');
      }
    }
  
    generateTexture(resId) {
      this.render();
      PIXI.Texture.addToCache(SYSTEM.renderer.generateTexture(this), resId);
    }
  
    generateAnimation(resId, frames) {
      this.tick = 0;
      this.update();
      let frameId = resId;
      for (let i = 0; i < frames; i++) {
        this.update();
  
        frameId = resId + '##' + i;
        PIXI.Texture.addToCache(SYSTEM.renderer.generateTexture(this), frameId);
      }
    }

    static loadAnimation(resId) {
      let frames = [];
      let i = 0;
      let frameId = resId + '##' + i;
      while(frameId in PIXI.utils.TextureCache) {
        frames.push(PIXI.Texture.fromFrame(frameId));
        
        i++;
        frameId = resId + '##' + i;
      }
  
      return new PIXI.extras.AnimatedSprite(frames);
    }

    render() {
    }
    
    update() { 
    }
  }