import { Drawing } from "@repcomm/exponent-ts";
import { trackRender } from "./trackrender.js";
import { TrackManager } from "./tracks.js";
export class Editor extends Drawing {
  constructor() {
    super();
    this.trackId = 0;
    this.addClasses("editor");
    this.trackRenderConfig = {
      ctx: undefined,
      h: 0,
      hScrollMax: 0,
      hScrollMin: 0,
      t: undefined,
      timeScrollMax: 0,
      timeScrollMin: 0,
      w: 0
    };

    this.trackRenderPass = ctx => {
      this.trackRenderConfig.w = Math.floor(this.rect.width);
      this.trackRenderConfig.h = Math.floor(this.rect.height);
      if (!this.trackRenderConfig.ctx) this.trackRenderConfig.ctx = ctx;
      if (!this.trackRenderConfig.t) this.trackRenderConfig.t = TrackManager.getTrack(this.trackId);

      if (!this.trackRenderConfig.t) {
        console.log(this.trackRenderConfig.t, "t");
        return; //cannot render without track
      }

      console.log("Render test");
      trackRender(this.trackRenderConfig);
    };

    this.addRenderPass(this.trackRenderPass);
    this.autoResize = true;
    this.setStyleItem("width", "100%");
    window.addEventListener("resize", () => {
      this.setStyleItem("max-height", `${this.element.parentElement.getBoundingClientRect().height}px`);
      this.setNeedsRedraw(true);
    });
  }

  setTrackId(id) {
    this.trackId = id;
    this.trackRenderConfig.t = undefined;
    this.setNeedsRedraw(true);
  }

  mount(parent) {
    this.setNeedsRedraw(true);
    return super.mount(parent);
  }

}