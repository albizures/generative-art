import { range } from './range';
import * as Pieza from 'pieza';

export interface RgbColor {
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
	const realSteps = steps;
	const ratioR = getStepRation(realSteps, firstColor.r, secondColor.r);
	const ratioG = getStepRation(realSteps, firstColor.g, secondColor.g);
	const ratioB = getStepRation(realSteps, firstColor.b, secondColor.b);

	for (const i of range([, steps])) {
		yield {
			r: Math.floor(firstColor.r + ratioR * i),
			g: Math.floor(firstColor.g + ratioG * i),
			b: Math.floor(firstColor.b + ratioB * i),
		};
	}

	// including the final color
	yield {
		...secondColor,
	};
}

const createGradient = (
	firstColor: RgbColor,
	secondColor: RgbColor,
	steps: number,
): RgbColor[] => {
	const colors = [];
	for (const color of fromFirstToSecondColor(firstColor, secondColor, steps)) {
		colors.push(color);
	}

	return colors;
};

const colorToString = (color: RgbColor) =>
	`rgb(${color.r}, ${color.g}, ${color.b})`;

const getPixelBrightness = (x: number, y: number) => {
	const context = Pieza.useContext();
	const { width } = Pieza.useMeasures();
	const r = context.pixels[(y * width + x) * 4];
	const g = context.pixels[(y * width + x) * 4 + 1];
	const b = context.pixels[(y * width + x) * 4 + 2];
	const a = context.pixels[(y * width + x) * 4 + 3];
	const color = context.color(r, g, b, a);
	const brightness = context.brightness(color) / 100;

	return brightness;
};

export {
	fromFirstToSecondColor,
	createGradient,
	colorToString,
	getPixelBrightness,
};
