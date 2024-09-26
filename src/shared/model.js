import Observable from '../framework/observable';

/**
 * Model parent abstract class
 * @template TModelData
 */
export default class Model extends Observable {
  /**
   * Model data
   * @type { TModelData }
   */
  #data = null;

  /**
   * Initial data
   * @type { TModelData }
   */
  #defaultData = null;

  /**
   * Model constructor
   * @param { ConstructorParams<TModelData> } constructorParams
   */
  constructor({ defaultData }) {
    super();
    if (new.target === Model) {
      throw new Error('Model is Abstract class!!');
    }

    this.#defaultData = defaultData;
  }

  get data() {
    return this.#data ?? this.#defaultData;
  }

  /**
   * Protected setter model data
   * @param { TModelData } value
   * @protected
   */
  set data(value) {
    this.#data = value;
  }

  /**
   * Data fetching
   * @param { FetchDataParams<TModelData> } FetchDataParams
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

/**
 * Constructor params
 * @template TModelData
 * @typedef { { defaultData: TModelData } } ConstructorParams
 */

/**
 * Fetch function callback type
 * @callback FetchFunction
 * @return { Promise<any> }
 */

/**
 * _fetchData params
 * @template TModelData
 * @typedef { { fetchFn: () => Promise<TModelData> } } FetchDataParams
 */

/**
 * @typedef { import('../service/actions').ModelActions } ModelActions
 */
