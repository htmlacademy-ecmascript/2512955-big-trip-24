export default class ServerDataAdapter {
  /**
   * Adapt model data to server data
   * @param { RoutePointModelData } routePoint
   * @returns { RoutePointServerData }
   */
  static adaptRoutePointToServer(routePoint) {
    return {
      'base_price': routePoint.basePrice,
      'date_from': routePoint.dateFrom,
      'date_to': routePoint.dateTo,
      'destination': routePoint.destination,
      'id': routePoint.id,
      'is_favorite': routePoint.isFavorite,
      'offers': [...routePoint.offers],
      'type': routePoint.type
    };
  }

  /**
   * Adapt server data to model data
   * @param { RoutePointServerData } routePoint
   * @returns { RoutePointModelData }
   */
  static adaptRoutePointToModel(routePoint) {
    return {
      basePrice: routePoint['base_price'],
      dateFrom: routePoint['date_from'],
      dateTo: routePoint['date_to'],
      destination: routePoint['destination'],
      id: routePoint['id'],
      isFavorite: routePoint['is_favorite'],
      offers: [...routePoint['offers']],
      type: routePoint['type']
    };
  }

  /**
   * Adapt server data to model data
   * @param { DestinationPictureServerData } destinationPicture
   * @returns { DestinationPictureModelData }
   */
  static #adaptDestinationPictureToModel(destinationPicture) {
    const { description, src } = destinationPicture;
    return {
      description,
      src
    };
  }

  /**
   * Adapt server data to model data
   * @param { DestinationServerData } destination
   * @returns { DestinationModelData }
   */
  static adaptDestinationToModel(destination) {
    const { id, name, pictures, description } = destination;
    return {
      id,
      name,
      pictures: (pictures?.length ?? 0) > 0 ? pictures.map((current) => this.#adaptDestinationPictureToModel(current)) : [],
      description
    };
  }

  /**
   * Adapt server data to model data
   * @param { OfferServerData } offer
   * @returns { OfferModelData }
   */
  static #adaptOfferToModel(offer) {
    const { id, price, title } = offer;
    return {
      id,
      price,
      title
    };
  }

  /**
   * Adapt server data to model data
   * @param { OfferByTypeServerData } offersByType
   * @returns { OfferByTypeModelData }
   */
  static adaptOffersByTypeToModel(offersByType) {
    const { offers, type } = offersByType;
    return {
      type,
      offers: (offers?.length ?? 0) > 0 ? offers.map((current) => ServerDataAdapter.#adaptOfferToModel(current)) : []
    };
  }
}

/**
 * @typedef { import('../config/route-points-types').RoutePointsTypes } RoutePointsTypes
 */

/**
 * @typedef { import('../model/route-model').RoutePointModelData } RoutePointModelData
 */

/**
 * @typedef { import('../service/route-api-service').RoutePointServerData } RoutePointServerData
 */

/**
 * @typedef { import('../service/route-api-service').DestinationPictureServerData } DestinationPictureServerData
 */

/**
 * @typedef { import('../service/route-api-service').DestinationServerData } DestinationServerData
 */

/**
 * @typedef { import('../service/route-api-service').OfferByTypeServerData } OfferByTypeServerData
 */

/**
 * @typedef { import('../service/route-api-service').OfferServerData } OfferServerData
 */

/**
 * @typedef { import('../model/offer-model').OfferByTypeModelData } OfferByTypeModelData
 */

/**
 * @typedef { import('../model/offer-model').OfferModelData } OfferModelData
 */

/**
 * @typedef { import('../model/route-destination-model').DestinationModelData } DestinationModelData
 */

/**
 * @typedef { import('../model/route-destination-model').DestinationPictureModelData } DestinationPictureModelData
 */
