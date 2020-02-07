const getRandomItem = <T>(items: T[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

const plusOrMinus = () => (Math.random() < 0.5 ? -1 : 1);
export { getRandomItem, plusOrMinus };
