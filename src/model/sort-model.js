import { DEFAULT_SORTING_TYPE } from '../config/sorting-types';
import ValueModel from '../shared/value-model';

/**
 * @extends ValueModel<SortingTypes>
 */
export default class SortModel extends ValueModel {
  constructor() {
    super();
    this._value = DEFAULT_SORTING_TYPE;
  }

  get sortType() {
    return this._value;
  }

  /**
   *
   * @param { ModelActions } changeType
   * @param { SortingTypes } newSortType
   */
  changeSort(changeType, newSortType) {
    this._changeValue(changeType, newSortType);
  }
}

/**
 * @typedef { import('../config/sorting-types').SortingTypes } SortingTypes
 */

/**
 * @typedef { import('../service/actions').ModelActions } ModelActions
 */
