import * as Pieza from 'pieza';
import p5 from 'p5';
import { range } from '../utils/range';
import {
	WithTail,
	drawTail,
	moveTailHead,
	createWithTail,
	WithTailType,
} from '../components/withTail';
import { createGradient } from '../utils/colors';
import { background } from '../utils/canvas';

interface Trail extends WithTail {}

interface Line {
	start: p5.Vector;
	end: p5.Vector;
}

type Change = -1 | 1;

interface Settings {
	lineSize: number;
	numberOfLines: number;
	maxLag: number;
	minLag: number;
}

interface State {
	lines: Line[];
	snakes: Trail[];
	lag: number;
	lagChange: Change;
	distanceFromCenter: number;
}

const firstColor = {
	r: 0,
	g: 241,
	b: 255,
};

const secondColor = {
	r: 255,
	g: 1,
	b: 154,
};

const setup = (): State => {
	const context = Pieza.useContext();
	const { numberOfLines, lineSize } = Pieza.useSettings<Settings>();
	context.angleMode(context.DEGREES);

	const angleInBetween = 360 / numberOfLines;
	const lines = [];
	const snakes = [];
	const distanceFromCenter = 0;

	for (const index of range([, numberOfLines])) {
		const angle = angleInBetween * index;
		const end = context.createVector(lineSize, 0).rotate(angle);
		const start = context.createVector(0, 0).rotate(angle);
		lines.push({
			start,
			end,
		});

		snakes.push(
			createWithTail(
				[end],
				100,
				createGradient(firstColor, secondColor, 10),
				WithTailType.POINT,
			),
		);
		snakes.push(
			createWithTail(
				[start],
				100,
				createGradient(firstColor, secondColor, 10),
				WithTailType.POINT,
			),
		);
	}

	return {
		lines,
		snakes,
		distanceFromCenter,
		lag: 0,
		lagChange: 1,
	};
};

const getChange = (
	currentChange: Change,
	value: number,
	minValue: number,
	maxValue: number,
): Change => {
	if (maxValue <= value) {
		return -1;
	}

	if (value <= minValue) {
		return 1;
	}

	return currentChange;
};

const update = (state: State): State => {
	const { lines, snakes } = state;
	const context = Pieza.useContext();
	const { lineSize, maxLag, minLag } = Pieza.useSettings<Settings>();

	const lagChange = getChange(state.lagChange, state.lag, minLag, maxLag);
	const lag = state.lag + state.lagChange;

	const distanceFromCenter = context.map(lag, minLag, maxLag, 0, lineSize - 1);

	lines.forEach((line, index) => {
		moveTailHead(snakes[index], line.end.copy());
		const start = line.end
			.copy()
			.rotate(lag)
			.setMag(distanceFromCenter);
		line.end.add(start.copy().sub(line.start));
		line.start = start;
		moveTailHead(snakes[index + lines.length], start);
	});

	return {
		...state,
		lag,
		lagChange,
		distanceFromCenter,
	};
};

const draw = () => {
	const context = Pieza.useContext();
	const { centerX, centerY } = Pieza.useMeasures();
	const { lines, snakes } = Pieza.useState<State>();

	background('black');
	context.translate(centerX, centerY);
	context.rotate(context.frameCount);

	for (const line of lines) {
		// context.point(line.end.x, line.end.y);
		// context.point(line.start.x, line.start.y);
		// context.ellipse(line.end.x, line.end.y, line.end.mag());
		// context.ellipse(line.start.x, line.start.y, line.start.mag());
		// context.ellipse(line.end.x, line.end.y, line.end.x, line.end.y);
		// context.ellipse(line.start.x, line.start.y, line.start.x, line.start.y);
		context.line(line.start.x, line.start.y, line.end.x, line.end.y);
	}

	for (const snake of snakes) {
		drawTail(snake);
	}
};

Pieza.create<Settings, State>({
	autoClean: true,
	settings: {
		maxLag: 90,
		minLag: -90,
		lineSize: 100,
		numberOfLines: 5,
	},
	update,
	name: '1',
	setup,
	draw,
});
