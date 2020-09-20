import * as Pieza from 'pieza';
import { SimpleVector } from '../types';
import { getPixelBrightness } from '../utils/colors';
import { getImageFitSize } from '../entities/image';
import { getFillingCircleLines } from '../entities/circle';
import { getRect } from '../utils';
import { Line } from '../entities/line';
import { background } from '../utils/canvas';

let image: Pieza.Image;
const detail = 15;

const preload = () => {
	const context = Pieza.useContext();
	context.pixelDensity(1);
	image = context.loadImage('/gt.png');
};

interface LineSection {
	line: Line;
	inside: boolean;
}

const isLine = (brightness: number) => {
	return brightness < 1;
};

const drawLineWithCurves = (line: Line, detail: number) => {
	const context = Pieza.useContext();
	const width = line.end.x - line.start.x;
	const sections = Math.ceil(width / detail);

	const points = [];
	for (let index = 0; index < sections; index++) {
		const x = index * detail + line.start.x;
		const isUp = false; //index % 2 === 1;
		const random = isUp ? 10 : -15; //((Math.random() * variance) / 2) * -1;
		const point = { x, y: line.start.y + random };
		points.push(point);
	}

	context.beginShape();
	context.vertex(line.start.x, line.start.y);
	console.log(points, sections, width, detail);
	for (let index = 1; index < points.length - 1; index++) {
		const point = points[index];
		const nextPoint = points[index + 1];
		const xc = (point.x + nextPoint.x) / 2;
		const yc = (point.y + nextPoint.y) / 2;
		context.quadraticVertex(point.x, point.y, xc, yc);
	}
	context.vertex(line.end.x, line.end.y);
	context.endShape();
};

const setup = () => {
	const context = Pieza.useContext();
	const { centerX, centerY } = Pieza.useMeasures();
	context.background('white');

	const imageSize = getImageFitSize(image, 200);

	const imgRect = getRect(imageSize, {
		x: centerX - imageSize.width / 2,
		y: centerY - imageSize.height / 2,
	});

	context.image(
		image,
		imgRect.left,
		imgRect.top,
		imgRect.width,
		imgRect.height,
	);

	context.loadPixels();
	context.clear();
	context.noFill();

	background('white');
	getFillingCircleLines(
		{
			position: {
				x: centerX,
				y: centerY,
			},
			radius: 280,
		},
		detail,
	)
		.map<LineSection[]>(({ start, end }) => {
			let wasInside = false;
			const section: LineSection[] = [];
			let lastPoint: SimpleVector | null = null;
			for (let x = start.x; x < end.x; x++) {
				const brightness = getPixelBrightness(x, start.y);
				const point = {
					x,
					y: start.y,
				};

				const inside = wasInside
					? isLine(brightness)
						? true // still inside
						: false //  not anymore
					: isLine(brightness)
					? true // it just started
					: wasInside; // not yet;

				if (inside && inside !== wasInside) {
					if (section.length === 0) {
						section.push({
							line: {
								start,
								end: point,
							},
							inside: false,
						});
					}
					if (lastPoint) {
						section.push({
							line: {
								start: lastPoint,
								end: point,
							},
							inside,
						});

						lastPoint = null;
					} else {
						lastPoint = point;
					}
				}

				if (x >= end.x - 1 && section.length > 1) {
					section.push({
						line: {
							start: section[section.length - 1].line.end,
							end,
						},
						inside: false,
					});
				}
				wasInside = inside;
			}
			if (section.length === 0) {
				section.push({
					line: {
						start,
						end,
					},
					inside: false,
				});
			}
			return section;
		})
		.forEach((lineSection) => {
			for (let index = 0; index < lineSection.length; index++) {
				const { inside, line } = lineSection[index];
				const { start, end } = line;

				if (inside) {
					context.stroke('white');
					drawLineWithCurves(line, detail + 10);
				} else {
					context.stroke('gray');
					context.line(start.x, start.y, end.x, end.y);
				}
			}
		});
};

export default Pieza.create({
	name: '11',
	setup,
	preload,
	settings: {
		steps: 20,
	},
});
