/* eslint-disable camelcase */
import { RoutePointsTypes } from '../../config/route-points-types';

export const NEW_ROUTE_POINT_DTO = {
  id: null,
  base_price: 0,
  date_to: null,
  destination: null,
  is_favorite: false,
  offers: [],
  type: RoutePointsTypes.FLIGHT
};
