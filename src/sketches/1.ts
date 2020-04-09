import * as Pieza from 'pieza';
import { background } from '../utils/canvas';
import { cyberpunk } from '../palettes';
import { getRandomItem } from '../utils';
import { Size, SimpleVector } from '../types';
import { range } from '../utils/range';

interface Settings {
	steps: number;
}

const drawLine = (position: SimpleVector, size: Size) => {
	const context = Pieza.useContext();
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
	const { width, height } = Pieza.useMeasures();
	const { steps } = Pieza.useSettings<Settings>();
	background('black');

	for (const y of range([, height], steps)) {
		for (const x of range([, width], steps)) {
			drawLine({ x, y }, { width: steps, height: steps });
		}
	}
};

export default Pieza.create<Settings>({
	name: '1',
	setup,
	settings: {
		steps: 20,
	},
});
