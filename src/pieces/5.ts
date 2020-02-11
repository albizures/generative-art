import * as Piece from '../Piece';
import { fromFirstToSecondColor } from '../utils/colors';
import { background } from '../utils/canvas';
import { Vector, Size } from '../types';
import { range } from '../utils/range';

const firstColor = {
	r: 255,
	g: 1,
	b: 154,
};

const secondColor = {
	r: 0,
	g: 241,
	b: 255,
};

const setup = () => {
	const context = Piece.useContext();
	context.strokeWeight(4);
	context.strokeCap(context.ROUND);
	background('black');
};

const draw = (
	{ x, y }: Vector,
	{ width, height }: Size,
	positions: number[],
) => {
	const context = Piece.useContext();
	context.push();
	context.translate(x + width / 2, y + height / 2);
	context.rotate(Math.random() * 5);
	context.translate(-width / 2, -height / 2);

	for (const index of range([, , positions.length])) {
		context.line(positions[index] * width, 0, positions[index] * width, height);
	}

	context.pop();
};

const paint = () => {
	const context = Piece.useContext();
	const { height, width } = Piece.useSize();

	const step = 20;
	const aThirdOfHeight = height / 3;

	const colors = fromFirstToSecondColor(
		firstColor,
		secondColor,
		(height - step) / step,
	);
	for (const y of range([step, height - step], step)) {
		const color = colors.next().value;
		for (const x of range([step, width - step], step)) {
			const positions = { x, y };
			const size = {
				width: step,
				height: step,
			};

			if (color) {
				context.stroke(`rgb(${color.r}, ${color.g}, ${color.b})`);
			}

			if (y < aThirdOfHeight) {
				draw(positions, size, [0.5]);
			} else if (y < aThirdOfHeight * 2) {
				draw(positions, size, [0.2, 0.8]);
			} else {
				draw(positions, size, [0.1, 0.5, 0.9]);
			}
		}
	}
};

Piece.create({
	name: '5',
	paint,
	setup,
});
