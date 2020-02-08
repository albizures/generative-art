import * as Piece from '../Piece';

const clean = () => {
	const context = Piece.useContext();

	context.clear();
};

const background = (color: string) => {
	const context = Piece.useContext();

	context.background('black');
};

export { clean, background };
