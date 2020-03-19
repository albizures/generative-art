import * as Pieza from 'pieza';
import { background } from '../utils/canvas';
import { createCube, Cube } from '../entities/cube';
import { Snake, createSnake, updateSnake, drawSnake } from '../entities/snake';
import { range } from '../utils/range';

interface Settings {
	snakeLength: number;
	cube: Cube;
	numberOfSnakes: number;
	changeTargetEach: number;
}

interface State {
	snakes: Snake[];
	changeTimer: number;
}

const setup = (): State => {
	const {
		cube,
		changeTargetEach,
		snakeLength,
		numberOfSnakes,
	} = Pieza.useSettings<Settings>();
	const context = Pieza.useContext();
	context.angleMode(context.DEGREES);
	background('black');

	const snakes = [];

	for (const index of range([0, numberOfSnakes])) {
		snakes.push(
			createSnake(
				context.createVector(0, 0),
				snakeLength,
				context.random(cube.vertices),
				firstColor,
				secondColor,
			),
		);
	}

	return {
		changeTimer: changeTargetEach,
		snakes,
	};
};

const update = (state: State) => {
	const context = Pieza.useContext();
	const { snakes, changeTimer } = state;
	const newState: Partial<State> = {};
	const { cube, changeTargetEach } = Pieza.useSettings<Settings>();

	for (const snake of snakes) {
		updateSnake(snake);
	}

	newState.changeTimer = changeTimer - context.deltaTime;
	if (changeTimer < 0) {
		newState.changeTimer = changeTargetEach;

		for (const snake of snakes) {
			snake.target = context.random(cube.vertices);
		}
	}

	return Object.assign({}, state, newState);
};

const draw = () => {
	const context = Pieza.useContext();
	const { snakes } = Pieza.useState<State>();
	const { cube } = Pieza.useSettings<Settings>();
	background('black');

	context.rotateY(context.mouseX);
	context.rotateX(context.mouseY);

	context.strokeWeight(2);

	for (const snake of snakes) {
		drawSnake(snake);

		// context.translate(0, 0, 0);
		// context.stroke(255);
		// context.strokeWeight(10);
		// drawPoint(snake.target);
	}

	context.strokeWeight(1);
	context.stroke(100);

	// drawEdges(cube);

	context.camera();
};

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

Pieza.create<Settings, State>({
	name: '8',
	type: Pieza.WEBGL,
	draw,
	update,
	setup,
	settings: {
		cube: createCube(100),
		numberOfSnakes: 1,
		changeTargetEach: 100,
		snakeLength: 100,
	},
});
