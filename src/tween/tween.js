import Easing from "./easing";

export default class Tween {
  constructor(config, startValue, endValue, onUpdate, onRepeat) {
    this.config = config;
    this.easing = this.config.easing;
    if(typeof Easing[this.easing] != 'function') {
      throw new Error("can not find easing function : " + this.easing);
    }
    this.duration = this.config.duration;
    this.repeat = this.config.repeat;

    this.setRange(startValue, endValue);
    this.onUpdate = onUpdate;
    this.onRepeat = onRepeat;

    this.enabled = false;
    this.reset();
  }
  
  setRange(startValue, endValue) {
    this.startValue = startValue;
    this.endValue = endValue;

    this.rangeValue = this.endValue - this.startValue;
  }

  reset() {
    this.tick = 0;
    this.repeatCounter = 0;
  }

  _finish() {
    if(typeof this.beforeFinish === 'function') {
      this.beforeFinish();
    }

    this.enabled = false;
    
    if (typeof this.onFinish  === 'function') {
      this.onFinish();
    }
  }

  start() {
    this.reset();
    this.enabled = true;

    if(typeof this.onStart === 'function') {
      this.onStart();
    }
  }

  stop() {
    this.reset();
    this.enabled = false;

    if(typeof this.onStop === 'function') {
      this.onStop();
    }
  }

  pause() {
    this.enabled = false;

    if(typeof this.onPause === 'function') {
      this.onPause();
    }
  }

  resume() {
    this.enabled = true;

    if(typeof this.onResume === 'function') {
      this.onResume();
    }
  }

  update() { 
    if (!this.enabled) {
      return;
    }

    this.tick++;
    if (this.tick > this.duration) {
      this.tick = 0;
      this.repeatCounter++;

      if(typeof this.onRepeat == 'function') {
        this.onRepeat(this.repeatCounter);
      }

      if(typeof this.repeat == 'number') {
        if(this.repeatCounter >= this.repeat) {
          this._finish();
          return;
        }
      } else if(typeof this.repeat == 'boolean') {
        if(!this.repeat) {
          this._finish();
          return;
        }
      } else {
        this._finish();
        return;
      }
    }
    
    if(typeof this.onUpdate == 'function') {
      const t = this.tick / this.duration;
      const v = Easing[this.easing](t) * this.rangeValue + this.startValue;
      this.onUpdate(v);
    }
  }
}