
import { Panel } from "@repcomm/exponent-ts";

export interface Cmd {
  timeStart: number;
  timeEnd: number;
  note: number;
}


export interface Track {
  instrument: number;
  cmds: Array<Cmd>;
  maxNote: number;
  minNote: number;
  minTime: number;
  maxTime: number;
}
export function trackSortCmds (t: Track) {
  t.cmds.sort((a, b)=> a.timeStart - b.timeStart);
}
const tracks = new Array<Track>();

export class TrackDisplay extends Panel {
  track: number;

  constructor () {
    super();
    this.addClasses("track-display");

    this.track = 0;

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
  render () {

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
