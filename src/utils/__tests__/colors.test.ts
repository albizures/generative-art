import { fromFirstToSecondColor, getStepRation } from '../colors';

const firstColor = {
	r: 100,
	g: 100,
	b: 240,
};

const secondColor = {
	r: 221,
	g: 250,
	b: 10,
};

describe('getStepRation', () => {
	test('returns with the step ratio', () => {
		const steps = 5;

		expect(getStepRation(steps, 0, 100)).toBe(20);
		expect(getStepRation(steps, 100, 0)).toBe(-20);
	});
});

describe('fromFirstToSecondColor', () => {
	test('returns with a color for each step', () => {
		const steps = 10;
		const colors = fromFirstToSecondColor(firstColor, secondColor, steps);

		for (let index = 0; index < steps; index++) {
			const { value, done } = colors.next();

			expect(value).toEqual(
				expect.objectContaining({
					r: expect.any(Number),
					g: expect.any(Number),
					b: expect.any(Number),
				}),
			);

			expect(done).toBe(false);

			if (index === 0) {
				expect(value).toEqual(firstColor);
			}

			if (index === steps - 1) {
				expect(value).toEqual(secondColor);
			}
		}

		const { value, done } = colors.next();
		expect(value).toBeUndefined();
		expect(done).toBe(true);
	});
});
