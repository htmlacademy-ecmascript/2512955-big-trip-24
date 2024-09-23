import { getFiltersFormTemplate } from './template';
import AbstractView from '../../framework/view/abstract-view';
import { DEFAULT_FILTER_TYPE, FilterTypes } from '../../config/filter-types';

/**
 * Filters form view
 * @extends AbstractView
 */
export default class EventsFilterFormView extends AbstractView {
  #activeFilterType = DEFAULT_FILTER_TYPE;
  /**
   * @type { RouteCountsByFiltersInfo }
   */
  #recordCounts = null;

  /**
   * @type { OnChangeFilterCallback }
   */
  #onChangeFilterCallback = null;
  /**
   * Constructor params
   * @param { { onFilterChange: OnChangeFilterCallback, filtersRecordCountInfo: RouteCountsByFiltersInfo, activeFilterType: FilterTypes } } params
   */
  constructor({ onFilterChange, filtersRecordCountInfo, activeFilterType }) {
    super();
    this.#onChangeFilterCallback = onFilterChange;
    this.#recordCounts = filtersRecordCountInfo;
    this.#activeFilterType = activeFilterType;
    this.element.addEventListener('change', this.#onFilterInputChange);
  }

  get template() {
    return getFiltersFormTemplate(Object.values(FilterTypes), this.#activeFilterType, this.#recordCounts);
  }

  /**
   * Change filter event listener
   * @param { Event } event
   */
  #onFilterInputChange = (event) => {
    event.preventDefault();
    if (event.target?.checked) {
      const newFilterType = event.target.value;
      this.#onChangeFilterCallback(newFilterType);
    }
  };
}

/**
 * @callback OnChangeFilterCallback
 * @param { FilterTypes } newFilterType
 * @returns { void }
 */

/**
 * @typedef { import('../../config/filter-types').FilterTypes } FilterTypes
 */

/**
 * @typedef { import('../../model/route-model/route-model').RouteCountsByFiltersInfo } RouteCountsByFiltersInfo
 */
