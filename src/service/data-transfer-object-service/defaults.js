/* eslint-disable camelcase */
import { RoutePointsTypes } from '../../config/route-points-types';

/**
 * New route point object
 * @constant
 * @type { RoutePointDto }
 */
export const NEW_ROUTE_POINT_DTO = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  id: null,
  isFavorite: false,
  offers: [],
  type: RoutePointsTypes.FLIGHT,
};

/**
 * OfferDto
 * @typedef { Object } OfferDto
 * @property { string } OfferDto.id
 * @property { string } OfferDto.title
 * @property { number } OfferDto.price
 */

/**
 * OffersByRoutePointTypeDto
 * @typedef { Object } OffersByRoutePointTypeDto
 * @property { RoutePointsTypes } OffersByRoutePointTypeDto.type
 * @property { OfferDto[] } OffersByRoutePointTypeDto.offers
 */

/**
 * DestinationPictureDto
 * @typedef { Object } DestinationPictureDto
 * @property { string } DestinationPictureDto.src
 * @property { string } DestinationPictureDto.description
 */

/**
 * DestinationDto
 * @typedef { Object } DestinationDto
 * @property { string } DestinationDto.id
 * @property { string } DestinationDto.description
 * @property { string } DestinationDto.name
 * @property { DestinationPictureDto[] } pictures
 */

/**
 * @typedef { import('../../config/route-points-types').RoutePointsTypes } RoutePointsTypes
 */

/**
 * RoutePointDto
 * @typedef { Object } RoutePointDto
 * @property { string | null } RoutePointDto.id
 * @property { number } RoutePointDto.basePrice
 * @property { string | null } RoutePointDto.dateFrom
 * @property { string | null } RoutePointDto.dateTo
 * @property { DestinationDto | null } RoutePointDto.destination
 * @property { boolean } RoutePointDto.isFavorite
 * @property { OfferDto[] } RoutePointDto.offers
 * @property { RoutePointsTypes } RoutePointDto.type
 */
