import * as Piece from '../Piece';
import { background } from '../utils/canvas';
import { cyberpunk } from '../palettes';
import { getRandomItem, plusOrMinus } from '../utils';
import { range } from '../utils/range';

const squareSize = 30;
const offset = 10;
const size = squareSize * 10 + offset * 2;

const drawRect = (width: number, height: number) => {
	const context = Piece.useContext();
	context.noFill();
	context.stroke(getRandomItem(cyberpunk));
	context.rect(0, 0, width, height);
};

const setup = () => {
	const context = Piece.useContext();
	background('black');

	const randomDisplacement = 15;
	const rotateMultiplier = 20;

	for (const x of range([0, 10])) {
		for (const y of range([0, 10])) {
			const rotateAmt =
				((y * 0.1 * Math.PI) / 180) *
				plusOrMinus() *
				Math.random() *
				rotateMultiplier;

			const translateAmt =
				y * 0.04 * plusOrMinus() * Math.random() * randomDisplacement;

			context.push();
			context.translate(
				x * squareSize + offset + translateAmt,
				y * squareSize + offset + translateAmt * plusOrMinus(),
			);
			context.rotate(rotateAmt);
			drawRect(squareSize, squareSize);
			context.pop();
		}
	}
};

Piece.create({
	name: '3',
	size: size,
	setup,
});
