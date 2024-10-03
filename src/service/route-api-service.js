import ApiService from '../framework/api-service';
import { HttpMethods } from '../config/api';

export default class RouteApiService extends ApiService {
  constructor({ endpoint, authorizationToken }) {
    super(endpoint, `Basic ${authorizationToken}`);
  }

  /**
   * @template TReturnType
   * @template TBodyType
   * @param { QueryParams<TBodyType> } params
   * @returns { Promise<TReturnType> }
   */
  async #getJsonResponse({
    url,
    method = HttpMethods.GET,
    body = null,
    headers = new Headers()
  }) {
    let stringifiedBody = body;

    if (body && typeof(body) === 'object') {
      stringifiedBody = JSON.stringify(body);
      headers.append('Content-Type', 'application/json');
    }

    const response = await this._load({url, method, body: stringifiedBody, headers});
    return await RouteApiService.parseResponse(response);
  }

  /**
   * Get route data
   * @returns { Promise<RoutePointServerData[]> }
   */
  async getRoute() {
    const endpoint = 'points';
    return await this.#getJsonResponse({ url: endpoint });
  }

  /**
   * Get offers data
   * @returns { Promise<OfferByTypeServerData[]> }
   */
  async getOffers() {
    const endpoint = 'offers';
    return await this.#getJsonResponse({ url: endpoint });
  }

  /**
   * Get destinations data
   * @returns { Promise<DestinationServerData[]> }
   */
  async getDestinations() {
    const endpoint = 'destinations';
    return await this.#getJsonResponse({ url: endpoint });
  }

  /**
   * Update route point
   * @param { RoutePointServerData } routePoint
   * @returns { Promise<RoutePointServerData> }
   */
  async updateRoutePoint(routePoint) {
    const endpoint = `points/${routePoint.id}`;
    return await this.#getJsonResponse({
      url: endpoint,
      method: HttpMethods.PUT,
      body: routePoint
    });
  }

  /**
   * Create route point
   * @param { RoutePointServerData } routePoint
   * @returns { Promise<RoutePointServerData> }
   */
  async createRoutePoint(routePoint) {
    const endpoint = 'points';
    return await this.#getJsonResponse({
      url: endpoint,
      method: HttpMethods.POST,
      body: routePoint
    });
  }

  /**
   * Delete route point
   * @param { RoutePointServerData } routePoint
   * @returns { Promise<void> }
   */
  async deleteRoutePoint(routePoint) {
    const endpoint = `points/${routePoint.id}`;
    this._load({
      url: endpoint,
      method: HttpMethods.DELETE
    });
  }
}

/**
 * @template TBodyType
 * @typedef { Object } QueryParams
 * @property { string } QueryParams.url
 * @property { HttpMethods } [QueryParams.method]
 * @property { TBodyType } [QueryParams.body]
 * @property { Headers } [QueryParams.headers]
 */

/**
 * @typedef { Object } ObjectWithApiInstance
 * @property { RouteApiService } ObjectWithApiInstance.api
 */

/**
 * @typedef { import('../config/route-points-types').RoutePointsTypes } RoutePointsTypes
 */

/**
 * @typedef { Object } RoutePointServerData
 * @property { string } RoutePointServerData.id
 * @property { number } RoutePointServerData.base_price
 * @property { string } RoutePointServerData.date_from
 * @property { string } RoutePointServerData.date_to
 * @property { string } RoutePointServerData.destination
 * @property { boolean } RoutePointServerData.is_favorite
 * @property { string[] } RoutePointServerData.offers
 * @property { RoutePointsTypes } RoutePointServerData.type
 */

/**
 * @typedef { Object } OfferByTypeServerData
 * @property { RoutePointsTypes } OfferByTypeServerData.type
 * @property { OfferServerData[] } OfferByTypeServerData.offers
 */

/**
 * @typedef { Object } OfferServerData
 * @property { string } OfferServerData.id
 * @property { string } OfferServerData.title
 * @property { number } OfferServerData.price
 */

/**
 * @typedef { Object } DestinationPictureServerData
 * @property { string } DestinationPictureServerData.src
 * @property { string } DestinationPictureServerData.description
 */

/**
 * @typedef { Object } DestinationServerData
 * @property { string } DestinationServerData.id
 * @property { string } DestinationServerData.name
 * @property { string } DestinationServerData.description
 * @property { DestinationPictureServerData[] } DestinationServerData.pictures
 */
