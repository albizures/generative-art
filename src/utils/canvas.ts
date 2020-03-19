import * as Pieza from 'pieza';

const clean = () => {
	const context = Pieza.useContext();

	context.clear();
};

const background = (color: string) => {
	const context = Pieza.useContext();

	context.background('black');
};

export { clean, background };
