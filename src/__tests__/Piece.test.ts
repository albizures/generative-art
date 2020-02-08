import { create, useContext, useSize } from '../Piece';

describe('useContext', () => {
	test('throws an error when used outside of a piece', () => {
		expect(useContext).toThrowError('useContext used outside of a piece');
	});
	test('retuns the context', () => {
		create({
			name: 'test-useContext',
			paint() {
				expect(useContext()).toBeDefined();
			},
		});
	});
});

describe('useSize', () => {
	test('throws an error when used outside of a piece', () => {
		expect(useSize).toThrowError('useSize used outside of a piece');
	});

	test('retuns the size', () => {
		create({
			name: 'test-useSize',
			size: 50,
			paint() {
				expect(useSize()).toEqual({
					height: 50,
					width: 50,
				});
			},
		});
	});
});

describe('create', () => {
	test('throws an error when duplicate names', () => {
		const paint = jest.fn();
		const setup = jest.fn();
		create({
			name: 'duplicate',
			paint,
			setup,
		});

		expect(() =>
			create({
				name: 'duplicate',
				paint,
				setup,
			}),
		).toThrowError("Name already used: 'duplicate'");
	});

	test('executes paint and setup right away', () => {
		const paint = jest.fn();
		const setup = jest.fn();
		create({
			name: 'test-create',
			paint,
			setup,
		});

		expect(paint).toHaveBeenCalledTimes(1);
		expect(setup).toHaveBeenCalledTimes(1);
	});
});
