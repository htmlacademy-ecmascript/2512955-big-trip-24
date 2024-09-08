/**
 * @template TElementType
 * @param { TElementType[] } source
 * @returns { TElementType | null }
 */
export const getRandomElementInArray = (source) => {
  if (Array.isArray(source)) {
    const randomIndex = Math.floor(Math.random() * source.length);
    return source[randomIndex];
  }

  return null;
};
