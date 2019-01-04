import ViewGroup from '../view/viewgroup';
import ViewError from '../view/viewerror';

export default class GridLayout extends ViewGroup {
  static LAYOUT_BY_ROW = 0x00;
  static LAYOUT_BY_COL = 0x01;

  onParseArgs(args) {
    this.direction = this._parseLayoutDirection(args[0]);
    this.rowCount = (typeof args[1] === 'number' && args[1] > 0) ? parseInt(args[1]) : 1;
    this.colCount = (typeof args[2] === 'number' && args[2] > 0) ? parseInt(args[2]) : 1;
  }

  _parseLayoutDirection(direction) {
    if(typeof direction === 'number') {
      if(direction != GridLayout.LAYOUT_BY_ROW && direction != GridLayout.LAYOUT_BY_COL) {
        throw new ViewError('invalid GridLayout `direction`: ' + direction);
      }

      return direction;
    }

    if(typeof direction === 'string') {
      if(direction === 'row') {
        return GridLayout.LAYOUT_BY_ROW;
      } else if(direction === 'col') {
        return GridLayout.LAYOUT_BY_COL;
      }
    }

    throw new ViewError('`direction` of GridLayout should be `row | col` or `GridLayout.LAYOUT_BY_ROW | GridLayout.LAYOUT_BY_COL`');
  }

  onMeasure() {
    if (this.direction == GridLayout.LAYOUT_BY_ROW) {
      this.colCount = Math.ceil(this.childViews.length / this.rowCount);
    } else if (this.direction == GridLayout.LAYOUT_BY_COL) {
      this.rowCount = Math.ceil(this.childViews.length / this.colCount);
    }

    let y = this.padding.top;
    let maxWidth = 0;
    for (let i = 0; i < this.rowCount; i++) {
      let maxHeight = 0;
      let x = this.padding.left;
      for (let j = 0; j < this.colCount; j++) {
        let view = this.childViews[i * this.colCount + j];
        if (typeof view === 'undefined') {
          break;
        }
        
        x += (view.margin.left + view.layoutWidth + view.margin.right);
        const viewHeight = view.margin.top + view.layoutHeight + view.margin.bottom;
        if (viewHeight > maxHeight) {
          maxHeight = viewHeight;
        }
      }
      
      if (x > maxWidth) {
        maxWidth = x;
      }

      y += maxHeight;
    }

    return [maxWidth + this.padding.right, y + this.padding.bottom];
  }

  onLayout() {
    if (this.direction == GridLayout.LAYOUT_BY_ROW) {
      this.colCount = Math.ceil(this.childViews.length / this.rowCount);
    } else if (this.direction == GridLayout.LAYOUT_BY_COL) {
      this.rowCount = Math.ceil(this.childViews.length / this.colCount);
    }
    
    let y = this.padding.top;
    let maxWidth = 0;
    for (let i = 0; i < this.rowCount; i++) {
      let maxHeight = 0;
      let x = this.padding.left;
      for (let j = 0; j < this.colCount; j++) {
        let view = this.childViews[i * this.colCount + j];
        if (typeof view == 'undefined') {
          break;
        }

        x += view.margin.left;
        view.x = x;
        view.y = y;
        this.addChild(view);

        x += (view.layoutWidth + view.margin.right);

        const viewHeight = view.margin.top + view.layoutHeight + view.margin.bottom;
        if (viewHeight > maxHeight) {
          maxHeight = viewHeight;
        }
      }

      y += maxHeight;
      if (x > maxWidth) {
        maxWidth = x;
      }
    }
  }
}