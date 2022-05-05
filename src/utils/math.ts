
export const lerp = (from: number, to: number, by: number): number => {
  return from*(1-by)+to*by;
}

export const inverseLerp = (from: number, to: number, value: number): number => {
  return (value - from) / (to - from);
}

export const random = {
  float (min: number = 0, max: number = 255): number {
    return lerp(min, max, Math.random());
  },
  int (min: number = 0, max: number = 255): number {
    return Math.floor(random.float(min, max));
  },
  rgb (min: number = 0, max: number = 255): string {
    return `rgb(${random.int(min,max)},${random.int(min,max)},${random.int(min,max)})`;
  }
};
