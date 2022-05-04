
import { ImagePanel, Panel, Text } from "@repcomm/exponent-ts";

export class ImgBtn extends Panel {
  img: ImagePanel;
  label: Text;

  constructor () {
    super();
    this.addClasses("exponent-image-button");

    this.img = new ImagePanel()
    .addClasses("exponent-button-image-img")
    .mount(this);

    this.label = new Text()
    .addClasses("exponent-button-image-label")
    .mount(this);
  }
  setImage (url: string): this {
    this.img.setImage(url);
    return this;
  }
  setTextContent(str: string): this {
    this.label.setTextContent(str);
    return this;
  }
  getTextContent(): string {
    return this.label.getTextContent();
  }
}
