import * as Piece from '../Piece';
type Context = CanvasRenderingContext2D;
const clean = (context: Context) => {
	const { height, width } = Piece.useSize();
	context.clearRect(0, 0, height, width);
};

const background = (color: string) => {
	const context = Piece.useContext();
	context.save();
	context.fillStyle = color;
	context.fillRect(0, 0, context.canvas.width, context.canvas.height);
	context.restore();
};

export { clean, background };
