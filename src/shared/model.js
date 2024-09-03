export default class Model {
  #data = null;
  #defaultData = null;

  constructor({ defaultData }) {
    this.#defaultData = defaultData;
  }

  get data() {
    return this.#data ?? this.#defaultData;
  }

  async _fetchData({ fetchFn }) {
    this.#data = await fetchFn();
  }
}
