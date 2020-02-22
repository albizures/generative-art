import * as Piece from '../Piece';
import { Vector } from '../types';
import { background } from '../utils/canvas';
import { getRandomItem } from '../utils';
import { cyberpunk } from '../palettes';
import { range } from '../utils/range';

type Lines = Vector[][];

const setup = () => {
	const context = Piece.useContext();

	context.strokeJoin(context.BEVEL);
	context.strokeCap(context.SQUARE);
	context.strokeWeight(1);
};

function drawTriangle(pointA: Vector, pointB: Vector, pointC: Vector) {
	const context = Piece.useContext();

	context.fill(getRandomItem(cyberpunk));
	context.triangle(pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y);
	context.stroke('black');
}

const createLines = (gap: number, offset: number) => {
	const { width, height } = Piece.useSize();
	const lines = [];
	let odd = false;

	for (let y = gap / 2 + offset; y <= height - offset; y += gap) {
		const line = [];
		odd = !odd;

		for (let x = gap / 4 + offset; x <= width - offset; x += gap) {
			const point = {
				x: x + (Math.random() * 0.8 - 0.4) * gap + (odd ? gap / 2 : 0),
				y: y + (Math.random() * 0.8 - 0.4) * gap,
			};

			line.push(point);
		}
		lines.push(line);
	}

	return lines;
};

const drawLines = (lines: Lines) => {
	let odd = true;

	for (const y of range([, lines.length - 1])) {
		odd = !odd;
		const dotLine = [];

		for (const i of range([, lines[y].length])) {
			if (odd) {
				dotLine.push(lines[y][i]);
				dotLine.push(lines[y + 1][i]);
			} else {
				dotLine.push(lines[y + 1][i]);
				dotLine.push(lines[y][i]);
			}
		}

		for (const i of range([, dotLine.length - 2])) {
			drawTriangle(dotLine[i], dotLine[i + 1], dotLine[i + 2]);
		}
	}
};

const paint = () => {
	const { width } = Piece.useSize();
	background('black');

	const offset = 30;
	const gap = width / 7;
	const lines = createLines(gap, offset);

	drawLines(lines);
};

Piece.create({
	name: '4',
	paint,
	setup,
});
