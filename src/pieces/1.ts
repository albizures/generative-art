import * as Piece from '../Piece';
import { background } from '../utils/canvas';
import { cyberpunk } from '../palettes';
import { getRandomItem } from '../utils';
import { Vector, Size } from '../types';

interface Settings {
	steps: number;
}

const draw = (position: Vector, size: Size) => {
	const context = Piece.useContext();
	const leftToRight = Math.random() >= 0.5;
	context.beginPath();
	if (leftToRight) {
		context.moveTo(position.x, position.y);
		context.lineTo(position.x + size.width, position.y + size.height);
	} else {
		context.moveTo(position.x + size.width, position.y);
		context.lineTo(position.x, position.y + size.height);
	}

	context.strokeStyle = getRandomItem(cyberpunk);
	context.stroke();
};

const paint = () => {
	const { width, height } = Piece.useSize();
	const { steps } = Piece.useSettings<Settings>();
	background('black');
	console.log(steps);

	for (let y = 0; y < height; y += steps) {
		for (let x = 0; x < width; x += steps) {
			draw({ x, y }, { width: steps, height: steps });
		}
	}
};

Piece.create<Settings>({
	name: '1',
	paint,
	settings: {
		steps: 20,
	},
});
