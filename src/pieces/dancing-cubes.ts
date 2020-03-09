import * as Piece from '../Piece';
import { background } from '../utils/canvas';
import { getRandomItem } from '../utils';
import { createGradient, colorToString, RgbColor } from '../utils/colors';
import { Vector } from '../types';
import { range } from '../utils/range';

const firstColor = {
	r: 255,
	g: 1,
	b: 154,
};

const secondColor = {
	r: 1,
	g: 97,
	b: 232,
};

interface State {
	squares: InceptionSquare[];
}

interface Settings {
	numberOfTiles: number;
	minSize: number;
	directions: number[];
	steps: number;
}

interface InceptionSquare {
	origin: Vector;
	steps: number;
	gradient: RgbColor[];
	direction: Vector;
	size: number;
}

const drawSquare = (square: InceptionSquare, stepsLeft: number) => {
	const context = Piece.useContext();
	const { gradient, size: startSize, direction, steps } = square;
	const { minSize } = Piece.useSettings();

	if (stepsLeft < 0) {
		return;
	}

	context.stroke(colorToString(gradient[stepsLeft]));

	const size = startSize * (stepsLeft / steps) + minSize;
	const deltaLeftSize = (square.size - size) / 2;
	const x = square.origin.x - direction.x * (deltaLeftSize / (stepsLeft + 3));
	const y = square.origin.y - direction.y * (deltaLeftSize / (stepsLeft + 3));
	context.square(x, y, size);

	drawSquare(square, stepsLeft - 1);
};

const getValidDirection = (currentDirection: number) => {
	const { directions } = Piece.useSettings<Settings>();

	let nextDirection = getRandomItem(directions);

	while (
		Math.abs(currentDirection - nextDirection) === 2 ||
		nextDirection === currentDirection
	) {
		nextDirection = getRandomItem(directions);
	}

	return nextDirection;
};

function update(state: State) {
	const { squares } = state;

	return {
		squares: squares.map((square) => {
			return {
				...square,
				direction: {
					x: getValidDirection(square.direction.x),
					y: getValidDirection(square.direction.y),
				},
			};
		}),
	};
}

const draw = () => {
	const context = Piece.useContext();
	const { squares } = Piece.useState<State>();
	context.clear();
	background('black');

	for (const square of squares) {
		drawSquare(square, square.steps);
	}
};

const setup = () => {
	const { numberOfTiles, directions, steps } = Piece.useSettings<Settings>();
	const { width, height } = Piece.useSize();
	const context = Piece.useContext();

	context.frameRate(5);
	context.noFill();
	context.strokeWeight(2);
	context.rectMode(context.CENTER);

	const margin = 10;
	const tileSize = width / numberOfTiles;
	const halfTileSize = tileSize / 2;

	const squares = [];

	for (const x of range([, width], tileSize)) {
		for (const y of range([, height], tileSize)) {
			squares.push({
				size: tileSize - margin,
				origin: {
					x: x + halfTileSize,
					y: y + halfTileSize,
				},
				steps: steps - 2, // counting zero
				direction: {
					x: getRandomItem(directions),
					y: getRandomItem(directions),
				},
				gradient: createGradient(firstColor, secondColor, steps),
			});
		}
	}

	return {
		squares,
	};
};

Piece.create<Settings, State>({
	name: 'dancing-cubes',
	setup,
	draw,
	update,
	settings: {
		steps: getRandomItem([5, 6, 7]),
		minSize: 3,
		numberOfTiles: 5,
		directions: [-1, 0, 1],
	},
});
