import ViewGroup from "../view/viewgroup";
import ViewError from "../view/viewerror";

export default class LinearLayout extends ViewGroup {
  static LAYOUT_VERTICAL = 0x00;
  static LAYOUT_HORIZONTAL = 0x01;

  onParseArgs(args) {
    this.direction = this._parseLayoutDirection(args[0]);
  }

  _parseLayoutDirection(direction) {
    if(typeof direction === 'number') {
      if(direction != LinearLayout.LAYOUT_VERTICAL && direction != LinearLayout.LAYOUT_HORIZONTAL) {
        throw new ViewError('invalid LinearLayout `direction`: ' + direction);
      }

      return direction;
    }

    if(typeof direction === 'string') {
      if(direction === 'vertical') {
        return LinearLayout.LAYOUT_VERTICAL;
      } else if(direction === 'horizontal') {
        return LinearLayout.LAYOUT_HORIZONTAL;
      }
    }

    throw new ViewError('`direction` of LinearLayout should be `vertical | horizontal` or `LinearLayout.LAYOUT_VERTICAL | LinearLayout.LAYOUT_HORIZONTAL`');
  }

  _layoutVertical() {
    const x =  this.alignOffsetX + this.padding.left;
    let y =  this.alignOffsetY + this.padding.top;

    let alignOffsetX = 0;
    let alignOffsetY = 0;
    for (const view of this.childViews) {
      [alignOffsetX, alignOffsetY] = super.getChildViewAlignParameter(view);
      y += (alignOffsetY + view.margin.top);
      
      view.x = x + alignOffsetX;
      view.y = y;

      y += (view.layoutHeight + view.margin.bottom);
    }
  }

  _layoutHorizontal() {
    let x = this.alignOffsetX + this.padding.left;
    const y = this.alignOffsetY + this.padding.top;

    let alignOffsetX = 0;
    let alignOffsetY = 0;
    for (const view of this.childViews) {
      [alignOffsetX, alignOffsetY] = super.getChildViewAlignParameter(view);
      x += (alignOffsetX + view.margin.left);

      view.x = x;
      view.y = y + alignOffsetY;

      x += (view.layoutWidth + view.margin.right);
    }
  }

  onMeasure() {
    if(this.direction == LinearLayout.LAYOUT_VERTICAL) {
      let maxWidth = 0;
      let viewWidth = 0;
      let viewHeight = 0;
      for(const view of this.childViews) {
        viewWidth = view.margin.left + view.layoutWidth + view.margin.right;
        if(viewWidth > maxWidth) {
          maxWidth = viewWidth;
        }

        viewHeight += (view.margin.top + view.layoutHeight + view.margin.bottom);
      }

      return [
        this.padding.left + maxWidth + this.padding.right, 
        this.padding.top + viewHeight + this.padding.bottom
      ];
    } else if(this.direction == LinearLayout.LAYOUT_HORIZONTAL) {
      let maxHeight = 0;
      let viewWidth = 0;
      let viewHeight = 0;
      for(const view of this.childViews) {
        viewHeight = view.margin.top + view.layoutHeight + view.margin.bottom;
        if(viewHeight > maxHeight) {
          maxHeight = viewHeight;
        }

        viewWidth += (view.margin.left + view.layoutWidth + view.margin.right);
      }
      
      return [
        this.padding.left + viewWidth + this.padding.right,
        this.padding.top + viewHeight + this.padding.bottom
      ];
    }

    return [-1, -1];
  }

  onLayout() {
    if(this.direction == LinearLayout.LAYOUT_HORIZONTAL) {
      this._layoutHorizontal();
    } else if(this.direction == LinearLayout.LAYOUT_VERTICAL) {
      this._layoutVertical();
    }
  }
} 