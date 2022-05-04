import { ImagePanel, Panel, Text } from "@repcomm/exponent-ts";
export class ImgBtn extends Panel {
  constructor() {
    super();
    this.addClasses("exponent-image-button");
    this.img = new ImagePanel().addClasses("exponent-button-image-img").mount(this);
    this.label = new Text().addClasses("exponent-button-image-label").mount(this);
  }

  setImage(url) {
    this.img.setImage(url);
    return this;
  }

  setTextContent(str) {
    this.label.setTextContent(str);
    return this;
  }

  getTextContent() {
    return this.label.getTextContent();
  }

}