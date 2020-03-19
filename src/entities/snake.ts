import { Vector } from 'p5';
import {
	WithTail,
	createWithTail,
	moveTailHead,
	getTailHead,
	drawTail,
} from '../components/withTail';
import {
	createWithMovement,
	WithMovement,
	nextStepTowards,
} from '../components/withMovement';
import { RgbColor, createGradient } from '../utils/colors';

export interface Snake extends WithTail, WithMovement {
	target: Vector;
}

const createSnake = (
	head: Vector,
	maxLength: number,
	target: Vector,
	startColor: RgbColor,
	endColor: RgbColor,
): Snake => {
	const gradient = createGradient(startColor, endColor, maxLength);
	const velocity = new Vector().set(100, 200, 10);

	const withTail = createWithTail([head], maxLength, gradient);

	getTailHead(withTail);
	return {
		...withTail,
		...createWithMovement(head, velocity),
		target,
		get position() {
			return getTailHead(withTail);
		},
	};
};

const drawSnake = (snake: Snake) => {
	drawTail(snake);
};

const updateSnake = (snake: Snake): Snake => {
	moveTailHead(snake, nextStepTowards(snake, snake.target));
	return snake;
};

export { createSnake, drawSnake, updateSnake };
