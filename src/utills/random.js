export const getRandomElementInArray = (source) => {
  if (Array.isArray(source)) {
    const randomIndex = Math.floor(Math.random() * source.length);
    return source[randomIndex];
  }

  return null;
};
