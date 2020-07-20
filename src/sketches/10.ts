import * as Pieza from 'pieza';

interface Settings {
	axiom: string;
}

const Line = 'L';
const Circle = 'C';
const Right45 = 'r';
const Left45 = 'l';
const Right90 = 'e';
const Push = '[';
const Pop = ']';
const Left90 = 'q';
const Mirror = 'm';
const Forward = '+';
const Backwards = '-';

const push = (...commands: string[]): string => {
	return [Push].concat(commands, Pop).join('');
};

const rules = {
	L: 'CL',
	C: 'CM',
	M: [
		push(Right45, push(Line, Forward, Circle)),
		push(Left45, push(Line, Forward, Circle)),
		// Mirror,
		// push(
		// 	push(Right45, Line, Forward, Circle),
		// 	push(Left45, Line, Forward, Circle),
		// ),
	].join(''),
};

const generate = (axiom: string, iterations: number) => {
	let lastStep = axiom;
	let currentStep = '';

	for (let iteration = 0; iteration < iterations; iteration++) {
		for (let index = 0; index < lastStep.length; index++) {
			const char = lastStep[index];
			const rule = rules[char];

			currentStep = currentStep + (rule || char);
		}

		lastStep = currentStep;
		currentStep = '';
	}

	return lastStep;
};

const setup = () => {
	const context = Pieza.useContext();
	const { centerX, centerY, width, height } = Pieza.useMeasures();
	const { axiom } = Pieza.useSettings<Settings>();

	context.angleMode(context.DEGREES);

	context.textSize(30);
	const gen = generate(axiom, 3);

	context.strokeWeight(1);
	context.text(gen, 10, width - 10);
	context.noFill();

	let movement = -30;

	context.push();
	// context.translate(centerX, height);
	context.translate(centerX, centerY);
	// context.translate(0, height);
	for (let index = 0; index < gen.length; index++) {
		const command = gen[index];

		if (command === Line) {
			context.line(0, 0, 0, movement);
		}

		if (command === Circle) {
			context.circle(0, 0, movement);
		}

		if (command === Left45) {
			context.rotate(45);
		}

		if (command === Right45) {
			context.rotate(-45);
		}

		if (command === Push) {
			context.push();
		}

		if (command === Forward) {
			context.translate(0, movement);
		}

		if (command === Backwards) {
			context.translate(0, -movement);
		}

		if (command === Mirror) {
			context.rotate(180);
		}

		if (command === Pop) {
			context.pop();
		}
	}
	context.pop();
};

export default Pieza.create<Settings>({
	name: '10',
	setup,
	settings: {
		axiom: 'M',
	},
});
