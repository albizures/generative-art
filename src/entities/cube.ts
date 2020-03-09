import { Vector } from '../Piece';
import { drawLine } from '../utils';

export interface Cube {
	vertices: [Vector, Vector, Vector, Vector, Vector, Vector, Vector, Vector];
}

const drawEdges = (cube: Cube) => {
	drawLine(cube.vertices[0], cube.vertices[1]);
	drawLine(cube.vertices[1], cube.vertices[2]);
	drawLine(cube.vertices[2], cube.vertices[3]);
	drawLine(cube.vertices[3], cube.vertices[0]);

	drawLine(cube.vertices[4], cube.vertices[5]);
	drawLine(cube.vertices[5], cube.vertices[6]);
	drawLine(cube.vertices[6], cube.vertices[7]);
	drawLine(cube.vertices[7], cube.vertices[4]);

	drawLine(cube.vertices[0], cube.vertices[5]);
	drawLine(cube.vertices[1], cube.vertices[6]);
	drawLine(cube.vertices[2], cube.vertices[7]);
	drawLine(cube.vertices[3], cube.vertices[4]);
};

const center = new Vector().set(0, 0);

const createCube = (size: number, origin = center): Cube => {
	const halfSize = size / 2;

	return {
		vertices: [
			new Vector().set(
				origin.x + -halfSize,
				origin.y + -halfSize,
				origin.z + -halfSize,
			),
			new Vector().set(
				origin.x + halfSize,
				origin.y + -halfSize,
				origin.z + -halfSize,
			),
			new Vector().set(
				origin.x + halfSize,
				origin.y + halfSize,
				origin.z + -halfSize,
			),
			new Vector().set(
				origin.x + -halfSize,
				origin.y + halfSize,
				origin.z + -halfSize,
			),
			new Vector().set(
				origin.x + -halfSize,
				origin.y + halfSize,
				origin.z + halfSize,
			),
			new Vector().set(
				origin.x + -halfSize,
				origin.y + -halfSize,
				origin.z + halfSize,
			),
			new Vector().set(
				origin.x + halfSize,
				origin.y + -halfSize,
				origin.z + halfSize,
			),
			new Vector().set(
				origin.x + halfSize,
				origin.y + halfSize,
				origin.z + halfSize,
			),
		],
	};
};

export { createCube, drawEdges };
