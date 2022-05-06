import { Panel } from "@repcomm/exponent-ts";
import { imgmkr } from "../utils/imgmkr.js";
import { random } from "../utils/math.js";
import { trackRender } from "./trackrender.js";
export function trackOptimise(t) {
  //sort commands by time
  t.maxNote = 0;
  t.minNote = 0;

  for (let cmd of t.cmds) {
    if (cmd.timeEnd < cmd.timeStart) {
      let temp = cmd.timeEnd;
      cmd.timeEnd = cmd.timeStart;
      cmd.timeStart = cmd.timeEnd;
    }

    if (cmd.noteStart > t.maxNote) t.maxNote = cmd.noteStart;
    if (cmd.noteStart < t.minNote) t.minNote = cmd.noteStart;
    if (cmd.timeStart < t.minTime) t.minTime = cmd.timeStart;
    if (cmd.timeEnd > t.maxTime) t.maxTime = cmd.timeEnd;
  }

  t.cmds.sort((a, b) => a.timeStart - b.timeStart);
}
export const TrackManager = {
  tracks: new Array(),

  getTrack(index) {
    return TrackManager.tracks[index];
  },

  hasTrack(index) {
    return index < TrackManager.tracks.length && index > -1;
  },

  createTrack() {
    let result = {
      cmds: [],
      instrument: 0,
      maxNote: 0,
      minNote: 0,
      maxTime: 0,
      minTime: 0,
      noteColor: random.rgb(128)
    };
    let index = TrackManager.tracks.length;
    TrackManager.tracks.push(result);
    return index;
  },

  removeTrack(index) {
    TrackManager.tracks.splice(index, 1);
  }

};
export class TrackDisplay extends Panel {
  constructor() {
    super();
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
    this.trackRenderImage = new Panel().addClasses("track-display-image").mount(this);
    this.addClasses("track-display");
    this.trackId = 0;
    this.on("mousemove", e => {
      let evt = e;
      this.setStyleItem("background-position-x", `${evt.clientX - this.rect.width / 2}px`);
      this.setStyleItem("background-position-y", `${this.rect.height / 2}px`);
    });
    this.on("mouseleave", () => {
      this.setStyleItem("background-position-x", "unset");
      this.setStyleItem("background-position-y", "unset");
    });

    this.trackRenderPass = ctx => {
      if (!this.trackRenderConfig.ctx) this.trackRenderConfig.ctx = ctx;
      if (!this.trackRenderConfig.t) this.trackRenderConfig.t = TrackManager.getTrack(this.trackId);
      if (!this.trackRenderConfig.t) return; //cannot render without track

      trackRender(this.trackRenderConfig);
    };
  }

  render() {
    if (!TrackManager.hasTrack(this.trackId)) return;
    let r = this.rect;
    this.trackRenderConfig.w = Math.floor(r.width);
    this.trackRenderConfig.h = Math.floor(r.height);
    let dataUrl = imgmkr(this.trackRenderConfig.w, this.trackRenderConfig.h, this.trackRenderPass);
    this.trackRenderImage.setStyleItem("background-image", `url(${dataUrl})`); // console.log(dataUrl);
  }

}
export class Tracks extends Panel {
  constructor() {
    super();
    this.listeners = new Set();
    this.addClasses("tracks");
    this.trackDisplays = new Set();

    for (let i = 0; i < 10; i++) {
      let trackId = TrackManager.createTrack();
      let track = TrackManager.getTrack(trackId);
      let cmdCount = random.int(0, 128);
      let maxTime = random.float(0, 1000);
      let minNote = random.int(0, 12);

      for (let _i = 0; _i < cmdCount; _i++) {
        let timeStart = Math.random() * maxTime;
        track.cmds.push({
          timeStart,
          timeEnd: timeStart + Math.random() * 100,
          noteStart: random.int(0, minNote)
        });
      }

      trackOptimise(track);
      let trackDisplay = new TrackDisplay().on("click", evt => {
        this.fireTrackEvent({
          trackId
        });
      }).mount(this);
      this.trackDisplays.add(trackDisplay);
      trackDisplay.trackId = trackId;
    }
  }

  fireTrackEvent(evt) {
    for (let listener of this.listeners) {
      listener(evt);
    }

    return this;
  }

  onTrackEvent(listener) {
    this.listeners.add(listener);
    return this;
  }

  mount(parent) {
    setTimeout(() => {
      for (let d of this.trackDisplays) {
        d.render();
      }
    }, 10);
    return super.mount(parent);
  }

}