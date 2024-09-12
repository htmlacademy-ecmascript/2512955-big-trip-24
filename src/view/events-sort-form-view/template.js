import { sortingTypeByFunction } from '../../utills/sorting';

/**
 * Get sorting form template
 * @param { SortingTypes[] } sortingTypes
 * @param { SortingTypes } activeSortingType
 * @returns { string }
 */
export const getEventsSortFormTemplate = (sortingTypes, activeSortingType) => {
  const renderSortingItem = (sortingType) => {
    const disabledAttribute = sortingTypeByFunction[sortingType] ? '' : 'disabled';
    const checkedAttribute = (sortingType === activeSortingType && !disabledAttribute) ? 'checked' : '';

    return `
      <div class="trip-sort__item  trip-sort__item--${sortingType}">
        <input id="sort-${sortingType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortingType}" ${checkedAttribute} ${disabledAttribute}>
        <label class="trip-sort__btn" for="sort-${sortingType}">
          ${sortingType}
        </label>
      </div>`;
  };

  return (sortingTypes?.length ?? 0) > 0
    ? `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sortingTypes.map(renderSortingItem).join('')}
      </form>`
    : '';
};

/**
 * @typedef { import('../../config/sorting-types').SortingTypes } SortingTypes
 */
