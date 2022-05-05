import { make } from "@repcomm/exponent-ts";

export interface imgmkrDrawCallback {
  (ctx: CanvasRenderingContext2D, w: number, h: number): void;
}

const canvas = make("canvas") as HTMLCanvasElement;
document.body.appendChild(canvas);
canvas.style.display = "none";
let ctx = canvas.getContext("2d");

export function imgmkr(width: number, height: number, draw: imgmkrDrawCallback): string {
  let result: string;

  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  ctx.clearRect(0, 0, width, height);

  ctx.resetTransform();

  draw(ctx, width, height);

  result = canvas.toDataURL();

  return result;
}
