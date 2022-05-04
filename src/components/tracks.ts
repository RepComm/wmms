
import { Panel } from "@repcomm/exponent-ts";

export class TrackDisplay extends Panel {
  constructor () {
    super();
    this.addClasses("track-display");

    this.on("mousemove", (e)=>{
      let evt = e as MouseEvent;
      this.setStyleItem("background-position-x", `${evt.clientX - (this.rect.width/2)}px`);
      this.setStyleItem("background-position-y", `${this.rect.height/2}px`);
    });
    this.on("mouseleave", ()=>{
      this.setStyleItem("background-position-x", "unset");
      this.setStyleItem("background-position-y", "unset");
    });
  }
}

export class Tracks extends Panel {
  constructor () {
    super();
    this.addClasses("tracks");

    for (let i=0; i<10; i++) {
      new TrackDisplay().mount(this);
    }
  }
}
