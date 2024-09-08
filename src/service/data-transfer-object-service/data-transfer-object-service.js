import { NEW_ROUTE_POINT_DTO } from './defaults';

/**
 * Get Data Transfer Objects functions
 * @static
 */
export default class DataTransferObjectService {
  /**
   * Get RoutePointDto without destination and offers
   * @param { RoutePointData } routePoint
   * @returns { RoutePointDto }
   */
  static getShortRoutePointDto(routePoint) {
    return {
      id: routePoint.id,
      basePrice: routePoint.base_price,
      dateFrom: routePoint.date_from,
      dateTo: routePoint.date_to,
      destination: null,
      isFavorite: routePoint.is_favorite,
      type: routePoint.type,
      offers: []
    };
  }

  /**
   * Get RoutePointDto by RoutePointData
   * @param { RoutePointData } routePoint
   * @param { OfferData[] } offers
   * @param { RouteDestinationData[] } destinations
   * @returns { RoutePointDto }
   */
  static getFullRoutePointDto(routePoint, offers, destinations) {
    const destinationDto = DataTransferObjectService.getDestinationDto(
      destinations.find((current) => current.id === routePoint?.destination)
    );

    const offersDto = routePoint?.offers?.length
      ? routePoint.offers.map((current) => DataTransferObjectService.getOfferDto(offers.find((offer) => current === offer.id)))
        .filter(Boolean)
      : [];

    const routePointDto = DataTransferObjectService.getShortRoutePointDto(routePoint);
    routePointDto.destination = destinationDto;
    routePointDto.offers = offersDto;
    return routePointDto;
  }

  /**
   * Get OfferDto by OfferData
   * @param { OfferData } offer
   * @returns { OfferDto }
   */
  static getOfferDto(offer) {
    if (offer) {
      return {
        id: offer.id,
        price: offer.price,
        title: offer.title
      };
    }

    return null;
  }

  /**
   * Get DestinationDto by RouteDestinationData
   * @param { RouteDestinationData } destination
   * @returns { DestinationDto }
   * @static
   */
  static getDestinationDto(destination) {
    if (destination) {
      return {
        id: destination.id,
        description: destination.description,
        name: destination.name,
        pictures: destination?.pictures?.length
          ? destination.pictures.map((current) => ({
            src: current.src,
            description: current.description
          }))
          : []
      };
    }

    return null;
  }

  /**
   * Get new route point object
   * @returns { RoutePointDto }
   */
  static getNewRoutePointDto() {
    return structuredClone(NEW_ROUTE_POINT_DTO);
  }
}

/**
 * @typedef { import('./defaults').DestinationDto } DestinationDto
 */

/**
 * @typedef { import('./defaults').OfferDto } OfferDto
 */

/**
 * @typedef { import('./defaults').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { import('../../model/offer-model').OfferData } OfferData
 */

/**
 * @typedef { import('../../model/route-destination-model').RouteDestinationData } RouteDestinationData
 */

/**
 * @typedef { import('../../model/route-model').RoutePointData } RoutePointData
 */

/**
 * @typedef { import('./defaults').DestinationPictureDto } DestinationPictureDto
 */
