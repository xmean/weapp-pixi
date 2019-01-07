import ViewError from "../view/viewerror";
import ScrollView from "./scrollview";
import LinearLayout from "../layout/linearlayout";
import GridLayout from "../layout/gridlayout";

export default class ListView extends ScrollView {
  static LAYOUT_LINEAR_VERTICAL = 0x00;
  static LAYOUT_LINEAR_HORIZONTAL = 0x01;
  static LAYOUT_GRID_BY_ROW = 0x02;
  static LAYOUT_GRID_BY_COL = 0x03;

  constructor(attrs, width, height, items, onCreateItemView, layout, rowCount, colCount) {
    if(typeof onCreateItemView != 'function') {
      throw new ViewError("onCreateItemView must be implemented");
    }
    
    let view = null;
    if (layout == ListView.LAYOUT_LINEAR_HORIZONTAL) {
      view = new LinearLayout({}, LinearLayout.LAYOUT_HORIZONTAL);
    } else if (layout == ListView.LAYOUT_GRID_BY_ROW) {
      view = new GridLayout({}, GridLayout.LAYOUT_BY_ROW, rowCount, colCount);
    } else if (layout == ListView.LAYOUT_GRID_BY_COL) {
      view = new GridLayout({}, GridLayout.LAYOUT_BY_COL, rowCount, colCount);
    } else {
      view = new LinearLayout({}, LinearLayout.LAYOUT_VERTICAL);
    }

    const itemViews = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const itemView = onCreateItemView(item, i);
      itemViews.push(itemView);
    }
    view.addChildViewList(itemViews);
    
    super(attrs, view, width, height);

    this.itemViews = itemViews;
    if(typeof width == "number" && width != -1) {
      this.enableHorizontalScroll();
    }

    if(typeof height == "number" && height != -1) {
      this.enableVerticalScroll();
    }
  }

  updateItemData(items) {
    for (let i = 0; i < items.length; i++) {
      if(typeof this.itemViews[i] != 'undefined') {
        this.itemViews[i].updateItem(items[i], i);
      }
    }
  }
}