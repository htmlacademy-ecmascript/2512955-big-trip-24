/* eslint-disable camelcase */
import { RoutePointsTypes } from '../../config/route-points-types';

export const newRoutePointDto = {
  id: null,
  base_price: 0,
  date_to: null,
  destination: null,
  is_favorite: false,
  offers: [],
  type: RoutePointsTypes.FLIGHT
};
