import { make } from "@repcomm/exponent-ts";
const canvas = make("canvas");
document.body.appendChild(canvas);
canvas.style.display = "none";
let ctx = canvas.getContext("2d");
export function imgmkr(width, height, draw) {
  let result;
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  ctx.clearRect(0, 0, width, height);
  ctx.resetTransform();
  draw(ctx, width, height);
  result = canvas.toDataURL();
  return result;
}