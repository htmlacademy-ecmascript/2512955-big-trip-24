import { NEW_ROUTE_POINT_DTO } from './defaults';

/**
 * Get Data Transfer Objects functions
 * @static
 */
export default class DataTransferObjectService {
  /**
   * Get RoutePointDto without destination and offers
   * @param { RoutePointModelData } routePoint
   * @returns { RoutePointDto }
   */
  static getShortRoutePointDto(routePoint) {
    const { basePrice, dateFrom, dateTo, id, isFavorite, type } = routePoint;
    return {
      id,
      basePrice,
      dateFrom,
      dateTo,
      destination: null,
      isFavorite,
      type,
      offers: []
    };
  }

  /**
   * Get RoutePointDto by RoutePointData
   * @param { RoutePointModelData } routePoint
   * @param { OfferModelData[] } offers
   * @param { DestinationModelData[] } destinations
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
   * @param { OfferModelData } offer
   * @returns { OfferDto }
   */
  static getOfferDto(offer) {
    if (offer) {
      const { id, price, title } = offer;
      return {
        id,
        price,
        title
      };
    }

    return null;
  }

  /**
   * Get DestinationDto by RouteDestinationData
   * @param { DestinationModelData } destination
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

  /**
   * Get full route totals
   * @param { FullRouteInfo } routeTotals
   * @param { OfferModelData[] } offers
   * @param { DestinationModelData[] } destinations
   * @returns { RouteTotalsDto | null }
   */
  static getFullRouteInfoDto(routeTotals, offers, destinations) {
    if (routeTotals) {
      const dateFrom = routeTotals.routeDateFrom;
      const dateTo = routeTotals.routeDateTo;
      const destinationNames = routeTotals.destinationIds.map((current) => destinations.find((destination) => destination.id === current)?.name);
      return {
        dateFrom,
        dateTo,
        destinationNames,
        totalPrice: +routeTotals.totalBasePrice + routeTotals.offers.reduce((acc, current) => {
          const offerPrice = offers.find((offer) => offer.id === current)?.price ?? 0;
          return acc + offerPrice;
        }, 0)
      };
    }

    return null;
  }

  /**
   * Cast RoutePointDto to RoutePointData
   * @param { RoutePointDto } routePointDto
   * @returns { RoutePointModelData }
   */
  static createRoutePointDataByRoutePointDto(routePointDto) {
    const { basePrice, dateFrom, dateTo, id, type, isFavorite, destination, offers } = routePointDto;
    return {
      id,
      basePrice,
      dateFrom,
      dateTo,
      destination: destination?.id ? destination.id : null,
      isFavorite,
      type,
      offers: offers.map((current) => current.id)
    };
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
 * @typedef { import('../../model/offer-model').OfferModelData } OfferModelData
 */

/**
 * @typedef { import('../../model/route-destination-model').DestinationModelData } DestinationModelData
 */

/**
 * @typedef { import('../../model/route-model').RoutePointModelData } RoutePointModelData
 */

/**
 * @typedef { import('./defaults').DestinationPictureDto } DestinationPictureDto
 */

/**
 * @typedef { import('../../model/route-model').FullRouteInfo } FullRouteInfo
 */

/**
 * @typedef { import('./defaults').RouteTotalsDto } RouteTotalsDto
 */
