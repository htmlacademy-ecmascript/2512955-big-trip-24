import { DEFAULT_FILTER_TYPE } from '../../config/filter-types';

/**
 * Get filters form template
 * @param { FilterTypes[] } filterTypes
 * @param { FilterTypes } activeFilterType
 * @param { RouteCountsByFiltersInfo } recordCounts
 * @returns { string }
 */
export const getFiltersFormTemplate = (filterTypes, activeFilterType = DEFAULT_FILTER_TYPE, recordCounts) => {
  const renderFilterItem = (filterType) => {
    const filterCheckedAttribute = filterType === activeFilterType ? 'checked' : '';
    const filterDisabledAttrbute = ((recordCounts[filterType] ?? 0) === 0) ? 'disabled' : '';
    return `
      <div class="trip-filters__filter">
        <input id="filter-${filterType}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterType}" ${filterCheckedAttribute} ${filterDisabledAttrbute}>
        <label class="trip-filters__filter-label" for="filter-${filterType}">
          ${filterType}
        </label>
      </div>
    `;
  };

  return (filterTypes?.length ?? 0) > 0
    ? `<form class="trip-filters" action="#" method="get">
        ${filterTypes.map(renderFilterItem).join('')}
        <button class="visually-hidden" type="submit">
          Accept filter
        </button>
      </form>`
    : '';
};

/**
 * @typedef { import('./events-filter-form-view').RouteCountsByFiltersInfo } RouteCountsByFiltersInfo
 */
