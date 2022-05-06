import { lerp, inverseLerp } from "../utils/math.js";
export function trackRender(config) {
  let {
    ctx,
    t,
    w,
    h
  } = config;
  ctx.beginPath();
  let startX;
  let startY;
  let endX;
  let endY;
  let noteEnd;
  let cmdTimeStartNormalized = 0;
  let cmdTimeEndNormalized = 0;
  let cmdNoteStartNormalized = 0;
  let cmdNoteEndNormalized = 0;

  for (let cmd of t.cmds) {
    noteEnd = cmd.noteEnd === undefined ? cmd.noteStart : cmd.noteEnd;
    cmdTimeStartNormalized = inverseLerp(t.minTime, t.maxTime, cmd.timeStart);
    cmdNoteStartNormalized = inverseLerp(t.minNote, t.maxNote, cmd.noteStart);
    startX = lerp(0, w, cmdTimeStartNormalized);
    startY = lerp(0, h, cmdNoteStartNormalized);
    cmdTimeEndNormalized = inverseLerp(t.minTime, t.maxTime, cmd.timeEnd);
    cmdNoteEndNormalized = inverseLerp(t.minNote, t.maxNote, noteEnd);
    endX = lerp(0, w, cmdTimeEndNormalized);
    endY = lerp(0, h, cmdNoteEndNormalized);
    ctx.moveTo(startX, startY); //TODO: use easing function of note if present to draw curve (current not impl)

    ctx.lineTo(endX, endY);
  }

  let maxNoteDiff = Math.floor(t.maxNote - t.minNote);
  ctx.closePath();
  ctx.strokeStyle = t.noteColor;
  ctx.lineWidth = h / maxNoteDiff / 2;
  ctx.lineCap = "round";
  ctx.stroke();
}