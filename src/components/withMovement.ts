import { Vector } from 'p5';

export interface WithMovement {
	velocity: Vector;
	position: Vector;
}

const createWithMovement = (position: Vector, velocity: Vector) => {
	return {
		velocity,
		position,
	};
};

const nextStepTowards = (
	withMovement: WithMovement,
	target: Vector,
): Vector => {
	const { velocity, position } = withMovement;

	const acceleration = Vector.sub(target, position).setMag(1);

	velocity.add(acceleration).limit(10);

	return position.copy().add(velocity);
};

const moveTowards = (withMovement: WithMovement, target: Vector) => {
	withMovement.position = nextStepTowards(withMovement, target);

	return withMovement;
};

const WithMovement = {
	create: createWithMovement,
	moveTowards,
};

export { createWithMovement, nextStepTowards };
export default WithMovement;
