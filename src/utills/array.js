/**
 * Update item in array
 * @template TSourceData
 * @param { TSourceData[] } source
 * @param { TSourceData } value
 * @param { (current: TSourceData) => boolean } [compareFn]
 * @returns { TSourceData[] }
 */
export const updateItem = (sourceValues, updatedItem, compareFn) => {
  /**
   * Default comparer
   * @param { TSourceData } current
   * @returns { boolean }
   */
  const defaultCompareFunction = (current) => current === updatedItem;
  const comparer = compareFn ?? defaultCompareFunction;
  return sourceValues.map((current) => comparer(current) ? updatedItem : current);
};
