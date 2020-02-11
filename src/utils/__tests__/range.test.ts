import { range } from '../range';

describe('range', () => {
	test('make a range from the given start to the end without including the last one', () => {
		const fn = jest.fn();
		for (const index of range([0, 4])) {
			fn(index);
		}

		expect(fn).toHaveBeenCalledWith(0);
		expect(fn).toHaveBeenCalledWith(1);
		expect(fn).toHaveBeenCalledWith(2);
		expect(fn).toHaveBeenCalledWith(3);
		expect(fn).toHaveBeenCalledTimes(4);
	});

	test('make a range using the by the step given', () => {
		const fn = jest.fn();
		for (const index of range([0, 10], 3)) {
			fn(index);
		}

		expect(fn).toHaveBeenCalledWith(0);
		expect(fn).toHaveBeenCalledWith(3);
		expect(fn).toHaveBeenCalledWith(6);
		expect(fn).toHaveBeenCalledWith(9);
		expect(fn).toHaveBeenCalledTimes(4);
	});

	test('make an inclusive range', () => {
		const fn = jest.fn();
		for (const index of range([0, , 4])) {
			fn(index);
		}

		expect(fn).toHaveBeenCalledWith(0);
		expect(fn).toHaveBeenCalledWith(1);
		expect(fn).toHaveBeenCalledWith(2);
		expect(fn).toHaveBeenCalledWith(3);
		expect(fn).toHaveBeenCalledWith(4);
		expect(fn).toHaveBeenCalledTimes(5);
	});

	test('make a range from zero', () => {
		const fn = jest.fn();
		for (const index of range([, 4])) {
			fn(index);
		}

		expect(fn).toHaveBeenCalledWith(0);
		expect(fn).toHaveBeenCalledWith(1);
		expect(fn).toHaveBeenCalledWith(2);
		expect(fn).toHaveBeenCalledWith(3);
		expect(fn).toHaveBeenCalledTimes(4);
	});

	test('make an inclusive range from zero', () => {
		const fn = jest.fn();
		for (const index of range([, , 4])) {
			fn(index);
		}

		expect(fn).toHaveBeenCalledWith(0);
		expect(fn).toHaveBeenCalledWith(1);
		expect(fn).toHaveBeenCalledWith(2);
		expect(fn).toHaveBeenCalledWith(3);
		expect(fn).toHaveBeenCalledWith(4);
		expect(fn).toHaveBeenCalledTimes(5);
	});

	test('log a warning when no valid to is provided', () => {
		jest.spyOn(console, 'warn');
		range([, ,]);

		expect(console.warn).toHaveBeenCalledWith(
			"Ranger: returning an oneStepIterator since no valid 'to' was provided",
		);
	});

	test('one step range', () => {
		const fn = jest.fn();
		for (const index of range([10, ,])) {
			fn(index);
		}

		expect(fn).toHaveBeenCalledWith(10);
		expect(fn).toHaveBeenCalledTimes(1);
	});

	test('throw an error when infinity range is created', () => {
		expect(() => range([0, 10], -1)).toThrowError('Rang');
	});

	test('ignore infinity range error', () => {
		expect(() => range([0, 10], -1, false)).toThrowError('Rang');
	});
});
