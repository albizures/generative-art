const getRandomItem = <T>(items: T[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

const trueOrFalse = () => Math.random() < 0.5;
const plusOrMinus = () => (trueOrFalse() ? -1 : 1);

const distanceToCenter = (size: number, point: number) =>
  Math.abs(point - size / 2);

export { getRandomItem, plusOrMinus, trueOrFalse, distanceToCenter };
