import Model from '../shared/model';
import { getRandomRouteMock } from '../mock/route';
import { SortingTypes } from '../config/sorting-types';
import { sortingTypeByFunction } from '../utills/sorting';
import { updateItem } from '../utills/array';

/**
 * RouteModel
 * @extends Model<RoutePointData[]>
 */
export default class RouteModel extends Model {
  constructor() {
    super({ defaultData: [] });
  }

  async init() {
    super._fetchData({ fetchFn: getRandomRouteMock });
  }

  /**
   * Get route point by id
   * @param { string } pointId
   * @returns { RoutePointData }
   */
  getRoutePointById(pointId) {
    return this.data.find((current) => current.id === pointId);
  }

  /**
   * Delete route point
   * @param { ModelActions } modelActionType
   * @param { RoutePointData } routePoint
   */
  deleteRoutePoint(modelActionType, routePoint) {
    this.data = this.data.filter((current) => current.id !== routePoint.id);
    this._notify(modelActionType, routePoint);
  }

  /**
   * Add new route point
   * @param { ModelActions } modelActionType
   * @param { RoutePointData } routePoint
   */
  addNewRoutePoint(modelActionType, routePoint) {
    this.data = [...this.data, routePoint];
    this._notify(modelActionType, routePoint);
  }

  /**
   * Update existed route point
   * @param { RoutePointData } routePoint
   * @param { ModelActions } modelActionType
   */
  updateRoutePoint(modelActionType, routePoint) {
    /**
     * @param { RoutePointData } current
     * @returns { boolean }
     */
    const routeCompareFunction = (current) => current.id === routePoint.id;
    this.data = updateItem(this.data, routePoint, routeCompareFunction);
    this._notify(modelActionType, routePoint);
  }

  /**
   * Get route total info
   * @returns { FullRouteInfo | null }
   */
  getFullRouteInfo() {
    const daySortingFunction = sortingTypeByFunction[SortingTypes.DAY];
    const sortedData = daySortingFunction(this.data);

    if (sortedData.length > 0) {
      /**
      * @type { FullRouteInfo }
      */
      const result = {
        totalBasePrice: 0,
        offers: [],
        routeDateTo: sortedData[sortedData.length - 1].date_from,
        routeDateFrom: sortedData[0].date_from,
        destinationIds: []
      };

      return sortedData.reduce((accum, current) => {
        const destinationIds = [...accum.destinationIds];

        if (!destinationIds.find((destination) => current.destination === destination)) {
          destinationIds.push(current.destination);
        }

        return {
          ...accum,
          totalBasePrice: accum.totalBasePrice + current.base_price,
          offers: [...accum.offers, ...(current.offers ?? [])],
          destinationIds: destinationIds
        };
      }, result);
    }

    return null;
  }

  /**
   *
   * @param { FilterTypeByFunction } filters
   * @param { Date } date
   * @returns { RouteCountsByFiltersInfo }
   */
  getRoutesCountByFilters(filters, date) {
    return Object.keys(filters).reduce((accum, current) => {
      const filterFunction = filters[current];
      return {
        ...accum,
        [current]: (filterFunction(date, this.data)?.length ?? 0)
      };
    }, {});
  }
}

/**
 * RouteModelData
 * @typedef { Object } RoutePointData
 * @property { string } RoutePointData.id
 * @property { number } RoutePointData.base_price
 * @property { string } RoutePointData.date_from
 * @property { string } RoutePointData.date_to
 * @property { string } RoutePointData.destination
 * @property { boolean } RoutePointData.is_favorite
 * @property { string[] } RoutePointData.offers
 * @property { RoutePointsTypes } type
 */

/**
 * FullRouteInfo
 * @typedef { Object } FullRouteInfo
 * @property { string } FullRouteInfo.routeDateFrom
 * @property { string } FullRouteInfo.routeDateTo
 * @property { string[] } FullRouteInfo.destinationIds
 * @property { number } FullRouteInfo.totalBasePrice
 * @property { string[] } FullRouteInfo.offers
 */

/**
 * Route Counts By Filter info
 * @typedef { { [x: string]: number } } RouteCountsByFiltersInfo
 */

/**
 * @typedef { import('../config/route-points-types').RoutePointsTypes } RoutePointsTypes
 */

/**
 * @typedef { import('../utills/filter').FilterTypeByFunction } FilterTypeByFunction
 */

/**
 * @typedef { import('../service/actions').ModelActions } ModelActions
 */
