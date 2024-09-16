import { DEFAULT_SORTING_TYPE, SortingTypes } from '../../config/sorting-types';
import AbstractView from '../../framework/view/abstract-view';
import { getEventsSortFormTemplate } from './template';

/**
 * Events form sort view
 * @extends AbstractView
 */
export default class EventsSortFormView extends AbstractView {
  /**
   * @type { SortingTypes }
   */
  #activeSortingType = DEFAULT_SORTING_TYPE;

  /**
   * @type { onSortingChangeCallback }
   */
  #onSortingChangeCallback = null;
  /**
   * Constructor params
   * @param { { onSortingChangeCallback: OnChangeSortingCallback, activeSortType: SortingTypes } } params
   */
  constructor({ onSortingChangeCallback, activeSortType }) {
    super();
    this.#activeSortingType = activeSortType;
    this.#onSortingChangeCallback = onSortingChangeCallback;
    this.element.addEventListener('change', this.#onSortingChange);
  }

  /**
   *
   * @param { Event } event
   */
  #onSortingChange = (event) => {
    event.preventDefault();
    if (event.target?.checked) {
      const newSortingType = String(event.target.value).split('-')[1];
      this.#onSortingChangeCallback(newSortingType);
    }
  };

  get template() {
    return getEventsSortFormTemplate(Object.values(SortingTypes), this.#activeSortingType);
  }
}

/**
 * @callback OnChangeSortingCallback
 * @param { FilterTypes } newSortingType
 */

/**
 * @typedef { import('../../config/sorting-types').SortingTypes } SortingTypes
 */