export const lerp = (from, to, by) => {
  return from * (1 - by) + to * by;
};
export const inverseLerp = (from, to, value) => {
  return (value - from) / (to - from);
};
export const random = {
  float(min = 0, max = 255) {
    return lerp(min, max, Math.random());
  },

  int(min = 0, max = 255) {
    return Math.floor(random.float(min, max));
  },

  rgb(min = 0, max = 255) {
    return `rgb(${random.int(min, max)},${random.int(min, max)},${random.int(min, max)})`;
  }

};