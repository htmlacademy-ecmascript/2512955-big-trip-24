import Model from '../shared/model';
import { getOffersMock } from '../mock/offer';

/**
 * OfferModel
 * @extends Model<OfferModelData[]>
 */
export default class OfferModel extends Model {
  constructor() {
    super({defaultData: []});
  }

  async init() {
    super._fetchData({ fetchFn: getOffersMock });
  }

  /**
   * Get full offers by event type
   * @param { RoutePointsTypes } eventType
   * @returns { OfferData[] }
   */
  getOffersByEventType(eventType) {
    return this.data.find((current) => eventType === current.type)?.offers ?? [];
  }

  /**
   * Get all offers
   * @returns { OfferData[] }
   */
  getAllOffers() {
    return this.data.reduce((accum, current) => {
      if ((current?.offers?.length ?? 0) > 0) {
        return [...accum, ...current.offers];
      }
      return accum;
    }, []);
  }
}

/**
 * RoutePointsTypes
 * @typedef { import('../config/route-points-types').RoutePointsTypes } RoutePointsTypes
 */

/**
 * OfferModelData
 * @typedef { Object } OfferData
 * @property { string } OfferData.id
 * @property { string } OfferData.title
 * @property { number } OfferData.price
 */

/**
 * OfferModelData
 * @typedef { Object } OfferModelData
 * @property { RoutePointsTypes } type
 * @property { OfferData[] } offers
 */
