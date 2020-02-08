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
			r: Number.parseInt(String(firstColor.r + ratioR * i)),
			g: Number.parseInt(String(firstColor.g + ratioG * i)),
			b: Number.parseInt(String(firstColor.b + ratioB * i)),
		};
	}
}

export { fromFirstToSecondColor };
