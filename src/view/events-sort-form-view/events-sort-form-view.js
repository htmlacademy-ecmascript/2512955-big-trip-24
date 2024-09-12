import { DEFAULT_SORTING_TYPE, SortingTypes } from '../../config/sorting-types';
import AbstractView from '../../framework/view/abstract-view';
import { getEventsSortFormTemplate } from './template';

/**
 * Events form sort view
 * @extends AbstractView
 */
export default class EventsSortFormView extends AbstractView {
  /**
   * @type { onSortingChangeCallback }
   */
  #onSortingChangeCallback = null;
  /**
   * Constructor params
   * @param { { onSortingChangeCallback: OnChangeSortingCallback } } params
   */
  constructor({ onSortingChangeCallback }) {
    super();
    this.#onSortingChangeCallback = onSortingChangeCallback;
    Array.from(this.element.querySelectorAll('input[type="radio"]')).forEach((current) => {
      current.addEventListener('change', this.#onSortingChange);
    });
  }

  /**
   * Select input
   * @param { SortingTypes } sortingType
   */
  selectSortingInputBySortingType(sortingType) {
    this.element.querySelector(`#sort-${ sortingType }`).checked = true;
    this.#onSortingChangeCallback(sortingType);
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
    return getEventsSortFormTemplate(Object.values(SortingTypes), DEFAULT_SORTING_TYPE);
  }
}

/**
 * @callback OnChangeSortingCallback
 * @param { FilterTypes } newSortingType
 */

/**
 * @typedef { import('../../config/sorting-types').SortingTypes } SortingTypes
 */
