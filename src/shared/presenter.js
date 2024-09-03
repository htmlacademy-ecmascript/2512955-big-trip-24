export default class Presenter {
  _dataService = null;

  constructor({ dataService }) {
    this._dataService = dataService;
  }
}
