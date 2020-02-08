interface RgbColor {
  r: number;
  b: number;
  g: number;
}

const getStepRation = (steps: number, first: number, second: number) => {
  return (second - first) / steps;
};

function* fromFirstToSecondColor(
  firstColor: RgbColor,
  secondColor: RgbColor,
  steps: number,
) {
  const ratioR = getStepRation(steps, firstColor.r, secondColor.r);
  const ratioG = getStepRation(steps, firstColor.b, secondColor.b);
  const ratioB = getStepRation(steps, firstColor.g, secondColor.g);

  for (let i = 0; i <= steps; i++) {
    yield {
      r: firstColor.r + ratioR * i,
      g: firstColor.g + ratioG * i,
      b: firstColor.b + ratioB * i,
    };
  }
}

export { fromFirstToSecondColor };
