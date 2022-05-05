import { Panel } from "@repcomm/exponent-ts";
import { imgmkr } from "../utils/imgmkr.js";
import { lerp, inverseLerp, random } from "../utils/math.js";
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
      minTime: 0
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
    this.noteColor = random.rgb(128);
    console.log(this.noteColor);
    this.addClasses("track-display");
    this.track = 0;
    this.on("mousemove", e => {
      let evt = e;
      this.setStyleItem("background-position-x", `${evt.clientX - this.rect.width / 2}px`);
      this.setStyleItem("background-position-y", `${this.rect.height / 2}px`);
    });
    this.on("mouseleave", () => {
      this.setStyleItem("background-position-x", "unset");
      this.setStyleItem("background-position-y", "unset");
    });

    this.renderPerform = (ctx, w, h) => {
      let t = TrackManager.getTrack(this.track);
      ctx.beginPath();
      let startX;
      let startY;
      let endX;
      let endY;
      let noteEnd;

      for (let cmd of t.cmds) {
        startX = lerp(0, w, inverseLerp(t.minTime, t.maxTime, cmd.timeStart));
        startY = lerp(0, h, inverseLerp(t.minNote, t.maxNote, cmd.noteStart));
        endX = lerp(0, w, inverseLerp(t.minTime, t.maxTime, cmd.timeEnd));

        if (cmd.noteEnd === undefined) {
          noteEnd = cmd.noteStart;
        } else {
          noteEnd = cmd.noteEnd;
        }

        endY = lerp(0, h, inverseLerp(t.minNote, t.maxNote, noteEnd));
        ctx.moveTo(startX, startY); //TODO: use easing function of note if present to draw curve (current not impl)

        ctx.lineTo(endX, endY);
      }

      ctx.closePath();
      ctx.strokeStyle = this.noteColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    };
  }

  render() {
    if (!TrackManager.hasTrack(this.track)) return;
    let r = this.rect;
    let w = Math.floor(r.width);
    let h = Math.floor(r.height);
    let dataUrl = imgmkr(w, h, this.renderPerform);
    this.setStyleItem("background-image", `url(${dataUrl})`);
    console.log(dataUrl);
  }

}
export class Tracks extends Panel {
  constructor() {
    super();
    this.addClasses("tracks");

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
      let trackDisplay = new TrackDisplay().mount(this);
      trackDisplay.track = trackId;
      setTimeout(() => {
        trackDisplay.render();
      }, 10000);
    }
  }

}