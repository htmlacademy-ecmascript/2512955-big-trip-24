import { dayjs } from '../utills/time';
import { SortingTypes } from '../config/sorting-types';

const DATE_DIFFERENCE_UNIT = 's';

/**
 * Sorting by day
 * @param { RoutePointData[] } routePoints
 * @returns { RoutePointData[] }
 */
const sortByDay = (routePoints) => {
  const routePointsCopy = [...routePoints];
  return routePointsCopy.sort((firstPoint, secondPoint) => {
    const firstPointDateFrom = dayjs(firstPoint.date_from);
    const secondPointDateFrom = dayjs(secondPoint.date_from);
    return firstPointDateFrom.diff(secondPointDateFrom, DATE_DIFFERENCE_UNIT);
  });
};

/**
 * Sorting by price
 * @param { RoutePointData[] } routePoints
 * @returns { RoutePointData[] }
 */
const sortByPrice = (routePoints) => {
  const routePointsCopy = [...routePoints];
  return routePointsCopy.sort((firstPoint, secondPoint) => {
    const firstPointPrice = firstPoint.base_price;
    const secondPointPrice = secondPoint.base_price;
    return secondPointPrice - firstPointPrice;
  });
};

/**
 * Sorting by time
 * @param { RoutePointData[] } routePoints
 * @returns { RoutePointData[] }
 */
const sortByTime = (routePoints) => {
  const routePointsCopy = [...routePoints];
  return routePointsCopy.sort((firstPoint, secondPoint) => {
    const firstPointDateFrom = dayjs(firstPoint.date_from);
    const secondPointDateFrom = dayjs(secondPoint.date_from);
    const firstPointDateTo = dayjs(firstPoint.date_to);
    const secondPointDateTo = dayjs(secondPoint.date_to);
    const secondPointLength = secondPointDateTo.diff(secondPointDateFrom, DATE_DIFFERENCE_UNIT);
    const firstPointLength = firstPointDateTo.diff(firstPointDateFrom, DATE_DIFFERENCE_UNIT);
    return secondPointLength - firstPointLength;
  });
};

export const sortingTypeByFunction = {
  [SortingTypes.DAY]: sortByDay,
  [SortingTypes.PRICE]: sortByPrice,
  [SortingTypes.TIME]: sortByTime
};

/**
 * @typedef { import('../model/route-model/route-model').RoutePointData }
 */
