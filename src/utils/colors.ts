interface RgbColor {
	r: number;
	b: number;
	g: number;
}

export const getStepRation = (steps: number, first: number, second: number) => {
	return (second - first) / steps;
};

function* fromFirstToSecondColor(
	firstColor: RgbColor,
	secondColor: RgbColor,
	steps: number,
) {
	// including the final color
	const realSteps = steps - 1;
	const ratioR = getStepRation(realSteps, firstColor.r, secondColor.r);
	const ratioG = getStepRation(realSteps, firstColor.g, secondColor.g);
	const ratioB = getStepRation(realSteps, firstColor.b, secondColor.b);

	for (let i = 0; i < steps; i++) {
		yield {
			r: firstColor.r + ratioR * i,
			g: firstColor.g + ratioG * i,
			b: firstColor.b + ratioB * i,
		};
	}
}

export { fromFirstToSecondColor };
