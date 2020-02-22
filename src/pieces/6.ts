import * as Piece from '../Piece';
import { background } from '../utils/canvas';
import { range } from '../utils/range';
import { createGradient, colorToString } from '../utils/colors';

interface Settings {
	minRadius: number;
	maxRadius: number;
	totalCircles: number;
	circleCreateAttempts: number;
}

interface Circle {
	x: number;
	y: number;
	radius: number;
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

const createCircle = (): Circle => {
	const { width, height } = Piece.useSize();
	const { minRadius } = Piece.useSettings<Settings>();
	return {
		x: Math.floor(Math.random() * width),
		y: Math.floor(Math.random() * height),
		radius: minRadius,
	};
};

const checkCircle = (circle: Circle, circles: Circle[]): boolean => {
	const { width, height } = Piece.useSize();

	for (const index of range([, circles.length])) {
		const otherCircle = circles[index];
		const a = circle.radius + otherCircle.radius;
		const x = circle.x - otherCircle.x;
		const y = circle.y - otherCircle.y;

		if (a >= Math.sqrt(x * x + y * y)) {
			return false;
		}
	}

	if (circle.x + circle.radius >= width || circle.x - circle.radius <= 0) {
		return false;
	}

	if (circle.y + circle.radius >= height || circle.y - circle.radius <= 0) {
		return false;
	}

	return true;
};

const expandCircle = (circle: Circle, circles: Circle[]) => {
	const { minRadius, maxRadius } = Piece.useSettings<Settings>();
	for (const radiusSize of range([minRadius, maxRadius])) {
		circle.radius = radiusSize;
		if (!checkCircle(circle, circles)) {
			circle.radius = circle.radius - 3;
			break;
		}
	}
};

const setup = () => {
	const context = Piece.useContext();
	const { height } = Piece.useSize();
	const { totalCircles, circleCreateAttempts, minRadius } = Piece.useSettings<
		Settings
	>();
	background('black');

	const gradient = createGradient(firstColor, secondColor, height / minRadius);

	const circles = [];
	for (const _ of range([, totalCircles])) {
		for (const _ of range([, circleCreateAttempts])) {
			const circle = createCircle();
			if (!checkCircle(circle, circles)) {
				// let's try again
				continue;
			}

			expandCircle(circle, circles);
			circles.push(circle);

			const color = gradient[Math.floor(circle.y / minRadius)];
			context.stroke(colorToString(color));
			context.noFill();
			context.circle(circle.x, circle.y, circle.radius * 2);

			// the circle was created
			break;
		}
		// break;
	}
};

Piece.create<Settings>({
	name: '6',
	setup,
	settings: {
		minRadius: 2,
		maxRadius: 100,
		totalCircles: 500,
		circleCreateAttempts: 500,
	},
});
