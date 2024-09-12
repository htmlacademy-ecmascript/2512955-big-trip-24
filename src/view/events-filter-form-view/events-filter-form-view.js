import { getFiltersFormTemplate } from './template';
import AbstractView from '../../framework/view/abstract-view';
import { DEFAULT_FILTER_TYPE, FilterTypes } from '../../config/filter-types';

/**
 * Filters form view
 * @extends AbstractView
 */
export default class EventsFilterFormView extends AbstractView {
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
   * @param { { onFilterChange: OnChangeFilterCallback, filtersRecordCountInfo: RouteCountsByFiltersInfo } } params
   */
  constructor({ onFilterChange, filtersRecordCountInfo }) {
    super();
    this.#onChangeFilterCallback = onFilterChange;
    this.#recordCounts = filtersRecordCountInfo;

    Array.from(this.element.querySelectorAll('input[type="radio"]')).forEach((current) => {
      current.addEventListener('change', this.#onFilterInputChange);
    });
  }

  get template() {
    return getFiltersFormTemplate(Object.values(FilterTypes), DEFAULT_FILTER_TYPE, this.#recordCounts);
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
 * @typedef { import('../../model/route-model').RouteCountsByFiltersInfo } RouteCountsByFiltersInfo
 */
