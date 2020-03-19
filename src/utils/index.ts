import * as Pieza from 'pieza';
import { Vector } from 'p5';

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

export {
	getRandomItem,
	plusOrMinus,
	trueOrFalse,
	distanceToCenter,
	drawLine,
	drawPoint,
};
