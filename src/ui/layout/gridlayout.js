import ViewGroup from "../view/viewgroup";

export default class GridLayout extends ViewGroup {
  static LAYOUT_BY_ROW = 0x00;
  static LAYOUT_BY_COL = 0x01;

  constructor(style, direction, rowCount, colCount) {
    super(style);

    this.direction = direction;
    
    if(typeof rowCount == 'number' && rowCount > 0) {
      this.rowCount = rowCount;
    } else {
      this.rowCount = 1;
    }
    
    if(typeof colCount == 'number' && colCount > 0) {
      this.colCount = colCount;
    } else {
      this.colCount = 1;
    }
  }

  render() {
    this._layout();
    this._renderBackground();
  }

  _layout() {
    if (this.direction == GridLayout.LAYOUT_BY_ROW) {
      this.colCount = Math.ceil(this.views.length / this.rowCount);
    } else if (this.direction == GridLayout.LAYOUT_BY_COL) {
      this.rowCount = Math.ceil(this.views.length / this.colCount);
    }
    
    this.removeChildren();

    let y = this.padding.top;
    let maxWidth = 0;
    for (let i = 0; i < this.rowCount; i++) {
      let maxHeight = 0;
      let x = this.padding.left;
      for (let j = 0; j < this.colCount; j++) {
        let view = this.views[i * this.colCount + j];
        if (typeof view == 'undefined') {
          break;
        }

        x += view.margin.left;
        view.x = x;
        view.y = y;
        this.addChild(view);

        x += (view.layoutWidth + this.margin.right);

        let viewHeight = view.margin.top + view.layoutHeight + view.margin.bottom;
        if (viewHeight > maxHeight) {
          maxHeight = viewHeight;
        }
      }

      y += maxHeight;
      if (x > maxWidth) {
        maxWidth = x;
      }
    }

    this.layoutWidth = maxWidth + this.padding.right;
    this.layoutHeight = y + this.padding.bottom;
  }
}