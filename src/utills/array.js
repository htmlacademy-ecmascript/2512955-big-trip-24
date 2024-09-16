/**
 * Update item in array
 * @template TSourceData
 * @param { TSourceData[] } source
 * @param { TSourceData } value
 * @param { (current: TSourceData) => boolean } [compareFn]
 * @returns { TSourceData[] }
 */
export const updateItem = (source, value, compareFn) => {
  /**
   * Default comparer
   * @param { TSourceData } current
   * @returns { boolean }
   */
  const defaultCompareFunction = (current) => current === value;
  const sourceCopy = [...source].filter(compareFn ?? defaultCompareFunction);
  sourceCopy.push(value);
  return sourceCopy;
};
