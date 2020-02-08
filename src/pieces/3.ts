import * as Piece from '../Piece';
import { background } from '../utils/canvas';
import { cyberpunk } from '../palettes';
import { getRandomItem, plusOrMinus } from '../utils';

const squareSize = 30;
const offset = 10;
const size = squareSize * 10 + offset * 2;

const setup = () => {
	background('black');
};

const drawRect = (width: number, height: number) => {
	const context = Piece.useContext();
	context.noFill();
	context.stroke(getRandomItem(cyberpunk));
	context.rect(0, 0, width, height);
};

const paint = () => {
	const context = Piece.useContext();

	const randomDisplacement = 15;
	const rotateMultiplier = 20;

	for (let x = 0; x < 10; x++) {
		for (let y = 0; y < 10; y++) {
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
	paint,
	setup,
});
