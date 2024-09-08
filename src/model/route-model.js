import Model from '../shared/model';
import { getRandomRouteMock } from '../mock/route';

/**
 * RouteModel
 * @extends Model<RoutePointData[]>
 */
export default class RouteModel extends Model {
  constructor() {
    super({defaultData: []});
  }

  async init() {
    super._fetchData({ fetchFn: getRandomRouteMock });
  }
}

/**
 * RouteModelData
 * @typedef { Object } RoutePointData
 * @property { number } RoutePointData.base_price
 * @property { string } RoutePointData.date_from
 * @property { string } RoutePointData.date_to
 * @property { string } RoutePointData.destination
 * @property { boolean } RoutePointData.is_favorite
 * @property { string[] } RoutePointData.offers
 * @property { RoutePointsTypes } type
 */

/**
 * @typedef { import('../config/route-points-types').RoutePointsTypes } RoutePointsTypes
 */
