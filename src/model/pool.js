export default class ModelPool {
  constructor() {
    this.pool = [];
    this.models = [];
  }

  get() {
    if(this.pool.length <= 0) {
      if(typeof this.onCreateModel != 'function') {
        throw new Error('Create model for pooling, invalid `onCreateModel` function');
      }

      const model = this.onCreateModel();
      model.onFinish = () => {
        const index = this.models.indexOf(model);
        if(index >= 0) {
          if(typeof this.onFinish === 'function') {
            this.onFinish(model);
          }

          this.models.splice(index, 1);
          this.pool.push(model);
        }
      };
      this.pool.push(model);
    }

    const model = this.pool.pop();
    this.models.push(model);

    return model;
  }

  update() {
    for(const model of this.models) {
      if(typeof this.onUpdate === 'function') {
        this.onUpdate(model);
      }
    }
  }

  finishAll() {
    while(this.models.length > 0) {
      const model = this.models.pop();
      if(typeof this.onFinish === 'function') {
        this.onFinish(model);
      }
      this.pool.push(model); 
    }
  }
}