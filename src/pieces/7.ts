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

interface Settings {
	numberOfTiles: number;
	minSize: number;
	directions: number[];
}

interface Square {
	origin: Vector;
	stepsLeft: number;
	size: number;
}

const drawSquare = (
	square: Square,
	movement: Vector,
	gradient: RgbColor[],
	startSize: number,
) => {
	const context = Piece.useContext();
	const { minSize } = Piece.useSettings();
	const steps = gradient.length;

	context.noFill();

	context.stroke(colorToString(gradient[square.stepsLeft]));

	const size = startSize * (square.stepsLeft / steps) + minSize;
	context.square(square.origin.x, square.origin.y, size);
	const deltaLeftSize = (square.size - size) / 2;

	if (square.stepsLeft <= 0) {
		return;
	}
	drawSquare(
		{
			origin: {
				x:
					square.origin.x -
					movement.x * (deltaLeftSize / (square.stepsLeft + 1)),
				y:
					square.origin.y -
					movement.y * (deltaLeftSize / (square.stepsLeft + 1)),
			},
			size,
			stepsLeft: square.stepsLeft - 1,
		},
		movement,
		gradient,
		startSize,
	);
};

const setup = () => {
	const context = Piece.useContext();
	const { width, height } = Piece.useSize();
	const { numberOfTiles, directions } = Piece.useSettings<Settings>();
	background('black');
	context.strokeWeight(2);

	context.rectMode(context.CENTER);

	const tileSize = width / numberOfTiles;
	const halfTileSize = tileSize / 2;

	for (const x of range([, width], tileSize)) {
		for (const y of range([, height], tileSize)) {
			const steps = getRandomItem([3, 4, 5]);
			drawSquare(
				{
					size: tileSize,
					origin: {
						x: x + halfTileSize,
						y: y + halfTileSize,
					},
					stepsLeft: steps,
				},
				{
					x: getRandomItem(directions),
					y: getRandomItem(directions),
				},
				createGradient(firstColor, secondColor, steps + 1),
				tileSize,
			);
		}
	}
};

Piece.create<Settings>({
	name: '7',
	setup,
	settings: {
		minSize: 3,
		numberOfTiles: 5,
		directions: [-1, 0, 1],
	},
});
