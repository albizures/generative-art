import * as Pieza from 'pieza';
import { SimpleVector } from '../types';
import { Line } from './line';

interface Circle {
	position: SimpleVector;
	radius: number;
}

const getFillingCircleLines = (circle: Circle, spaceBetween = 10): Line[] => {
	const context = Pieza.useContext();
	const diameter = circle.radius * 2;
	const lineNumber = diameter / spaceBetween;
	const topX = circle.position.x - circle.radius;
	const topY = circle.position.y - circle.radius;

	const lines: Line[] = [];

	for (let index = 0; index <= lineNumber; index++) {
		const sagitta = index * spaceBetween;
		const chordLength = Math.sqrt(sagitta * diameter - sagitta * sagitta) * 2;
		const start = {
			x: Math.round(topX + circle.radius - chordLength / 2),
			y: topY + index * spaceBetween,
		};

		const end = {
			x: start.x + chordLength,
			y: start.y,
		};

		lines.push({
			start,
			end,
		});
	}

	return lines;
};

export { getFillingCircleLines };
