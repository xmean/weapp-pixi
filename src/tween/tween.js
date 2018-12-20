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

    this.reset();
  }
  
  setRange(startValue, endValue) {
    this.startValue = startValue;
    this.endValue = endValue;

    this.rangeValue = this.endValue - this.startValue;
  }

  reset() {
    this.ticker = 0;
    this.repeatCounter = 0;
    this.enabled = false;
  }

  _finish() {
    if (typeof this.onFinish != 'undefined') {
      this.onFinish();
    }

    this.enabled = false;
  }

  update() { 
    if (!this.enabled) {
      return;
    }

    this.ticker++;
    if (this.ticker > this.duration) {
      this.ticker = 0;

      if(typeof this.repeat == 'number') {
        this.repeatCounter++;

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

      if(typeof this.onRepeat == 'function') {
        this.onRepeat(this.repeatCounter);
      }
    }
    
    if(typeof this.onUpdate == 'function') {
      let t = this.ticker / this.duration;
      let v = Easing[this.easing](t) * (this.rangeValue) + this.startValue;
      this.onUpdate(v);
    }
  }
}