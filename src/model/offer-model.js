import Model from '../shared/model';
import ServerDataAdapter from '../service/server-data-adapter';

const DEFAULT_INIT_ERROR_MESSAGE = 'Can\'t init offers model';

/**
 * OfferModel
 * @extends { Model<OfferByTypeModelData[], RouteApiService> }
 */
export default class OfferModel extends Model {
  /**
   * @param { OfferModelConstuctorParams } params
   */
  constructor({ api }) {
    super({defaultData: [], api});
  }

  async init() {
    try {
      const serverData = await this._api.getOffers();
      this.data = serverData.map((current) => ServerDataAdapter.adaptOffersByTypeToModel(current));
    } catch(err) {
      throw new Error(err?.message ?? DEFAULT_INIT_ERROR_MESSAGE);
    }
  }

  /**
   * Get full offers by event type
   * @param { RoutePointsTypes } eventType
   * @returns { OfferModelData[] }
   */
  getOffersByEventType(eventType) {
    return this.data.find((current) => eventType === current.type)?.offers ?? [];
  }

  /**
   * Get all offers
   * @returns { OfferModelData[] }
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
 * @typedef { Object } OfferByTypeModelData
 * @property { RoutePointsTypes } OfferByTypeModelData.type
 * @property { OfferServerData[] } OfferByTypeModelData.offers
 */

/**
 * @typedef { Object } OfferModelData
 * @property { string } OfferModelData.id
 * @property { string } OfferModelData.title
 * @property { number } OfferModelData.price
 */


/**
 * @typedef { import('../service/route-api-service').ObjectWithApiInstance } OfferModelConstuctorParams
 */

/**
 * @typedef { import('../service/route-api-service').default } RouteApiService
 */
