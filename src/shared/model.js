/**
 * Constructor params
 * @typedef { Object } ConstructorParams
 * @property { any } ConstructorParams.defaultData
 */

/**
 * Fetch function callback type
 * @callback FetchFunction
 * @return { Promise<any> }
 */

/**
 * _fetchData params
 * @typedef { Object } FetchDataParams
 * @property { FetchFunction } FetchDataParams.fetchFn
 */


/**
 * Model parent abstract class
 */
export default class Model {
  /**
   * Model data
   * @type { any }
   */
  #data = null;

  /**
   * Initial data
   * @type { any }
   */
  #defaultData = null;

  /**
   * Model constructor
   * @param { ConstructorParams }
   */
  constructor({ defaultData }) {
    if (new.target === Model) {
      throw new Error('Model is Abstract class!!');
    }

    this.#defaultData = defaultData;
  }

  get data() {
    return this.#data ?? this.#defaultData;
  }

  /**
   * Data fetching
   * @param { FetchDataParams } FetchDataParams
   */
  async _fetchData({ fetchFn }) {
    this.#data = await fetchFn();
  }

  /**
   * Initialize model
   */
  async init() {
    throw new Error('Method init is abstract!');
  }
}
