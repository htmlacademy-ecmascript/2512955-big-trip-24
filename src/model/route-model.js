import Model from '../shared/model';
import { SortingTypes } from '../config/sorting-types';
import { sortingTypeByFunction } from '../utills/sorting';
import { updateItem } from '../utills/array';
import ServerDataAdapter from '../service/server-data-adapter';
import { ModelActions } from '../service/actions';

/**
 * @extends { Model<RoutePointModelData[], RouteApiService> } Route model
 */
export default class RouteModel extends Model {
  /**
   * @param { RouteModelConstructorParams } params
   */
  constructor({ api }) {
    super({ defaultData: [], api });
  }

  async init() {
    try {
      const serverData = await this._api.getRoute();
      this.data = serverData.map((current) => ServerDataAdapter.adaptRoutePointToModel(current));
      this._notify(ModelActions.INIT);
    } catch(err) {
      throw new Error(err?.message ?? 'Can\'t init route model');
    }
  }

  /**
   * Get route point by id
   * @param { string } pointId
   * @returns { RoutePointModelData }
   */
  getRoutePointById(pointId) {
    return this.data.find((current) => current.id === pointId);
  }

  /**
   * Delete route point
   * @param { ModelActions } modelActionType
   * @param { RoutePointModelData } routePoint
   */
  deleteRoutePoint(modelActionType, routePoint) {
    this.data = this.data.filter((current) => current.id !== routePoint.id);
    this._notify(modelActionType, routePoint);
  }

  /**
   * Add new route point
   * @param { ModelActions } modelActionType
   * @param { RoutePointModelData } routePoint
   */
  addNewRoutePoint(modelActionType, routePoint) {
    //TODO: Выпилить костыльный ID
    const fixedRoutePoint = {
      ...routePoint,
      id: crypto.randomUUID()
    };
    //TODO
    this.data = [...this.data, fixedRoutePoint];
    this._notify(modelActionType, fixedRoutePoint);
  }

  /**
   * Update existed route point
   * @param { RoutePointModelData } routePoint
   * @param { ModelActions } modelActionType
   */
  async updateRoutePoint(modelActionType, routePoint) {
    /**
     * @param { RoutePointModelData } current
     * @returns { boolean }
     */
    const routeCompareFunction = (current) => current.id === routePoint.id;
    try {
      const updatedItemServerData = await this._api.updateRoutePoint(ServerDataAdapter.adaptRoutePointToServer(routePoint));
      const adaptedItemToModel = ServerDataAdapter.adaptRoutePointToModel(updatedItemServerData);
      this.data = updateItem(this.data, adaptedItemToModel, routeCompareFunction);
      this._notify(modelActionType, adaptedItemToModel);
    } catch(err) {
      throw new Error(err?.message ?? 'Can\'t update route point');
    }
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
        routeDateTo: sortedData[sortedData.length - 1].dateFrom,
        routeDateFrom: sortedData[0].dateFrom,
        destinationIds: []
      };

      return sortedData.reduce((accum, current) => {
        const destinationIds = [...accum.destinationIds];

        if (!destinationIds.find((destination) => current.destination === destination)) {
          destinationIds.push(current.destination);
        }

        return {
          ...accum,
          totalBasePrice: accum.totalBasePrice + current.basePrice,
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
    const data = Object.keys(filters).reduce((accum, current) => {
      const filterFunction = filters[current];
      return {
        ...accum,
        [current]: (filterFunction(date, this.data)?.length ?? 0)
      };
    }, {});
    return data;
  }
}

/**
 * Model data
 * @typedef { Object } RoutePointModelData
 * @property { string } RoutePointModelData.id
 * @property { number } RoutePointModelData.basePrice
 * @property { string } RoutePointModelData.dateFrom
 * @property { string } RoutePointModelData.dateTo
 * @property { string } RoutePointModelData.destination
 * @property { boolean } RoutePointModelData.isFavorite
 * @property { string[] } RoutePointModelData.offers
 * @property { RoutePointsTypes } RoutePointModelData.type
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

/**
 * @typedef { import('../service/route-api-service').default } RouteApiService
 */

/**
 * @typedef { import('../service/route-api-service').ObjectWithApiInstance } RouteModelConstructorParams
 */
