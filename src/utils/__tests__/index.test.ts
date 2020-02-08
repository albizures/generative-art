import { trueOrFalse, distanceToCenter, getRandomItem, plusOrMinus } from '../';

describe('trueOrFalse', () => {
	test('returns true or false', () => {
		expect(typeof trueOrFalse()).toBe('boolean');
		expect(typeof trueOrFalse()).toBe('boolean');
		expect(typeof trueOrFalse()).toBe('boolean');
	});
});

describe('distanceToCenter', () => {
	test('returns the distance to the center', () => {
		expect(distanceToCenter(100, 10)).toBe(40);
		expect(distanceToCenter(100, 20)).toBe(30);
		expect(distanceToCenter(100, 30)).toBe(20);
		expect(distanceToCenter(100, 40)).toBe(10);
		expect(distanceToCenter(100, 50)).toBe(0);
		expect(distanceToCenter(100, 60)).toBe(10);
		expect(distanceToCenter(100, 70)).toBe(20);
		expect(distanceToCenter(100, 80)).toBe(30);
		expect(distanceToCenter(100, 90)).toBe(40);
	});
});

describe('getRadomItem', () => {
	test('returns an item from the given array', () => {
		const array = [{}, {}, {}];
		const item = getRandomItem(array);

		expect(array).toContain(item);
	});
});

describe('plusOrMinus', () => {
	test('returns only 1 or -1', () => {
		expect([1, -1]).toContain(plusOrMinus());
		expect([1, -1]).toContain(plusOrMinus());
		expect([1, -1]).toContain(plusOrMinus());
		expect([1, -1]).toContain(plusOrMinus());
		expect([1, -1]).toContain(plusOrMinus());
	});
});
