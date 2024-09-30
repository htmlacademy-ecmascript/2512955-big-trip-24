import { DEFAULT_FILTER_TYPE } from '../config/filter-types';
import ValueModel from '../shared/value-model';

/**
 * @extends ValueModel<FilterTypes>
 */
export default class FilterModel extends ValueModel {
  constructor() {
    super();
    this._value = DEFAULT_FILTER_TYPE;
  }

  /**
   * @type { FilterTypes }
   */
  get filterType() {
    return this._value;
  }

  /**
   * @param { ModelActions } changeType
   * @param { FilterTypes } newFilterType
   */
  changeFilter(changeType, newFilterType) {
    this._changeValue(changeType, newFilterType);
  }
}

/**
 * @typedef { import('../config/filter-types').FilterTypes } FilterTypes
 */

/**
 * @typedef { import('../service/actions').ModelActions } ModelActions
 */
