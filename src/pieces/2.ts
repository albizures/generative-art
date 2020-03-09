import * as Piece from '../Piece';
import { background } from '../utils/canvas';
import { fromFirstToSecondColor } from '../utils/colors';
import { distanceToCenter } from '../utils';
import { Vector } from '../types';
import { range } from '../utils/range';

const firstColor = {
	r: 0,
	g: 241,
	b: 255,
};

const secondColor = {
	r: 255,
	g: 1,
	b: 154,
};

type Lines = Vector[][];

const createLines = (step: number): Lines => {
	const { width, height } = Piece.useSize();
	const lines = [];

	for (const i of range([step + 45, , height - step], step)) {
		const line = [];
		for (const j of range([step, , width - step], step)) {
			const variance = Math.max(
				width / 2 - (50 + lines.length * 4) - distanceToCenter(width, j),
				0,
			);

			const random = ((Math.random() * variance) / 2) * -1;
			const point = { x: j > width - step ? width - step : j, y: i + random };
			line.push(point);
		}
		const lastPoint = line[line.length - 1];

		if (lastPoint.x < width) {
			lastPoint.x = width;
		}

		lines.push(line);
	}

	return lines;
};

const drawLines = (lines: Lines) => {
	const context = Piece.useContext();
	const colors = fromFirstToSecondColor(firstColor, secondColor, lines.length);
	background('black');

	context.fill('black');
	for (const i of range([, lines.length])) {
		const color = colors.next().value;
		const line = lines[i];
		context.beginShape();
		context.vertex(line[0].x, line[0].y);
		for (const j of range([, line.length - 1])) {
			context.strokeWeight(2);
			const point = line[j];
			const nextPoint = line[j + 1];
			const xc = (point.x + nextPoint.x) / 2;
			const yc = (point.y + nextPoint.y) / 2;
			if (color) {
				context.stroke(`rgb(${color.r}, ${color.g}, ${color.b})`);
			}
			context.quadraticVertex(point.x, point.y, xc, yc);
		}
		context.endShape();
	}
};

const setup = () => {
	const step = 10;
	const lines = createLines(step);

	drawLines(lines);
};

Piece.create({
	name: '2',
	setup,
});
