import * as Piece from '../Piece';
import { background } from '../utils/canvas';
import { cyberpunk } from '../palettes';
import { getRandomItem } from '../utils';
import { Vector, Size } from '../types';
import { range } from '../utils/range';

interface Settings {
	steps: number;
}

const drawLine = (position: Vector, size: Size) => {
	const context = Piece.useContext();
	const leftToRight = Math.random() >= 0.5;

	context.stroke(getRandomItem(cyberpunk));

	if (leftToRight) {
		context.line(
			position.x,
			position.y,
			position.x + size.width,
			position.y + size.height,
		);
	} else {
		context.line(
			position.x + size.width,
			position.y,
			position.x,
			position.y + size.height,
		);
	}
};

const setup = () => {
	const { width, height } = Piece.useSize();
	const { steps } = Piece.useSettings<Settings>();
	background('black');

	for (const y of range([, height], steps)) {
		for (const x of range([, width], steps)) {
			drawLine({ x, y }, { width: steps, height: steps });
		}
	}
};

Piece.create<Settings>({
	name: '1',
	setup,
	settings: {
		steps: 20,
	},
});
