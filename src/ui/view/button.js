import TextView from "./textview";

export default class Button extends TextView {
  constructor(attr, text, onClick) {
    super(attr, text);

    this.setOnClick(onClick);
  }

  setOnClick(onClick) {
    super.setOnClick(onClick);
  }
}