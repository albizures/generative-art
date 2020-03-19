import { Vector } from 'p5';
import * as Pieza from 'pieza';
import { RgbColor, colorToString, createGradient } from '../utils/colors';
import { range } from '../utils/range';

export interface WithTail {
	tail: {
		parts: Vector[];
		maxLenght: number;
		gradient: RgbColor[];
	};
}

const moveTailHead = <T extends WithTail>(
	withTail: T,
	nextPosition: Vector,
): T => {
	const { tail } = withTail;
	const { maxLenght, parts, gradient } = withTail.tail;

	if (parts.length >= maxLenght) {
		tail.parts = [nextPosition].concat(parts.slice(0, -1));
	} else {
		tail.parts = [nextPosition].concat(parts);
	}

	if (parts.length !== tail.parts.length) {
		tail.gradient = createGradient(
			gradient[0],
			gradient[gradient.length - 1],
			tail.parts.length,
		);
	}

	return withTail;
};

const drawTail = <T extends WithTail>(withTail: T): T => {
	const context = Pieza.useContext();
	const { parts, gradient } = withTail.tail;

	for (const index of range([1, parts.length])) {
		const start = parts[index - 1];
		const end = parts[index];

		context.stroke(colorToString(gradient[index % gradient.length]));
		context.line(start.x, start.y, start.z, end.x, end.y, end.z);
	}

	return withTail;
};

const getTailHead = <T extends WithTail>(withTail: T): Readonly<Vector> => {
	return withTail.tail.parts[0];
};

const createWithTail = (
	parts: Vector[],
	maxLenght: number,
	gradient: RgbColor[],
) => {
	return {
		tail: {
			parts,
			maxLenght,
			gradient,
		},
	};
};

export { createWithTail, moveTailHead, getTailHead, drawTail };
