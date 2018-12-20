import TextView from "./textview";

export default class Button extends TextView {
  constructor(style, text, onClick) {
    super(style, text);

    this.setOnClick(onClick);
  }

  setOnClick(onClick) {
    super.setOnClick(onClick);
  }
}