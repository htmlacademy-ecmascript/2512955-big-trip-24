import Observable from '../framework/observable';

/**
 * Model parent abstract class
 * @template TModelData Model data type
 * @template TApiInstanceType Api instance type
 */
export default class Model extends Observable {
  /**
   * @type { TApiInstanceType }
   */
  #api = null;

  get _api() {
    return this.#api;
  }

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
  constructor({ defaultData, api }) {
    super();
    if (new.target === Model) {
      throw new Error('Model is Abstract class!!');
    }

    this.#defaultData = defaultData;
    this.#api = api;
  }

  get data() {
    return structuredClone(this.#data ?? this.#defaultData);
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
   * Initialize model
   */
  async init() {
    throw new Error('Method init is abstract!');
  }
}

/**
 * Constructor params
 * @template TModelData
 * @template TApiInstanceType
 * @typedef { Object } ConstructorParams
 * @property { TModelData } ConstructorParams.defaultData
 * @property { RouteApiService } ConstructorParams.api
 */

/**
 * @typedef { import('../service/actions').ModelActions } ModelActions
 */
