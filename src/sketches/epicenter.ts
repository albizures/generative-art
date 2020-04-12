import * as Pieza from 'pieza';
import { range } from '../utils/range';

interface Settings {
	maxRadius: number;
	step: number;
	timeToChange: number;
	speed: number;
}

interface Circle {
	radius: 0;
}

interface State {
	circles: Circle[];
	index: number;
	timeUntilChange: number;
}

export default Pieza.create<Settings, State>({
	name: 'epicenter',
	setup() {
		const context = Pieza.useContext();
		const { maxRadius, step, timeToChange } = Pieza.useSettings<Settings>();
		context.stroke(4);

		const circles = [];

		for (const size of range([0, maxRadius], step)) {
			circles.push({
				radius: size,
			});
		}

		return {
			index: 0,
			circles,
			timeUntilChange: timeToChange,
		};
	},

	update(state) {
		const { speed, timeToChange } = Pieza.useSettings<Settings>();
		const context = Pieza.useContext();

		let index = state.index;
		let timeUntilChange = state.timeUntilChange;
		if (state.timeUntilChange < 0) {
			index = (index + 1) % state.circles.length;
			timeUntilChange = timeToChange;
		}

		timeUntilChange = timeUntilChange - speed * context.deltaTime;

		return {
			index,
			timeUntilChange,
		};
	},
	draw() {
		const { centerX, centerY } = Pieza.useMeasures();
		const { circles, index } = Pieza.useState<State>();
		const context = Pieza.useContext();

		context.clear();

		const current = circles[index];

		context.noFill();
		for (let index = circles.length - 1; -1 < index; index--) {
			const circle = circles[index];
			if (current === circle) {
				// context.circle(centerX, centerY, circle.radius - 5);
				context.strokeWeight(2);
			} else {
				context.strokeWeight(1);
			}
			context.circle(centerX, centerY, circle.radius);
		}
	},
	settings: {
		maxRadius: 500,
		step: 40,
		speed: 4,
		timeToChange: 200,
	},
});
