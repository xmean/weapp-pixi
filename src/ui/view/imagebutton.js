import ImageView from "./imageview";

export default class ImageButton extends ImageView {
  constructor(style, resId, onClick) {
    super(style, resId);

    this.setOnClick(onClick);
  }

  setOnClick(onClick) {
    super.setOnClick(onClick);
  }
}
