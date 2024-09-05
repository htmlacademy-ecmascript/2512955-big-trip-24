/**
 * Presenter constructor params
 * @typedef { Object } PresenterParams
 * @property { DataService } PresenterParams.dataService
 */

/**
 * Presenter parent abstract class
 */
export default class Presenter {
  /**
 * DataService instance
 * @type { DataService }
 */
  _dataService = null;

  /**
 * Presenter constructor
 * @param { PresenterParams } PresenterParams
 */
  constructor({ dataService }) {
    if (new.target === Presenter) {
      throw new Error('Presenter is abstract class!');
    }

    this._dataService = dataService;
  }

  /**
  * Initialize presenter
  */
  init() {
    throw new Error('Method init is abstract');
  }
}
