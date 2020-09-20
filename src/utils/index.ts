import * as Pieza from 'pieza';
import { Vector } from 'p5';
import { Size, SimpleVector, Rect } from '../types';

const getRandomItem = <T>(items: T[]) => {
	return items[Math.floor(Math.random() * items.length)];
};

const trueOrFalse = () => Math.random() < 0.5;
const plusOrMinus = () => (trueOrFalse() ? -1 : 1);

const distanceToCenter = (size: number, point: number) =>
	Math.abs(point - size / 2);

const drawPoint = (point: Vector) => {
	const context = Pieza.useContext();
	context.point(point.x, point.y, point.z);
};

const drawLine = (start: Vector, end: Vector) => {
	const context = Pieza.useContext();
	context.line(start.x, start.y, start.z, end.x, end.y, end.z);
};

const getRect = (size: Size, position: SimpleVector): Rect => {
	return {
		...size,
		top: position.x,
		bottom: position.y + size.height,
		left: position.x,
		right: position.x + size.width,
	};
};

export {
	getRandomItem,
	plusOrMinus,
	trueOrFalse,
	distanceToCenter,
	drawLine,
	drawPoint,
	getRect,
};
