import Model from '../shared/model';
import { getOffersMock } from '../mock/offer';

export default class OfferModel extends Model {
  constructor() {
    super({defaultData: []});
  }

  async init() {
    super._fetchData({ fetchFn: getOffersMock });
  }

  getOffersByEventType(eventType) {
    return this.data.find((current) => eventType === current.type).offers;
  }
}
