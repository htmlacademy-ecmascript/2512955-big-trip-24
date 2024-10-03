import { dayjs } from '../utills/time';
import { SortingTypes } from '../config/sorting-types';

const DATE_DIFFERENCE_UNIT = 's';

/**
 * Sorting by day
 * @param { RoutePointModelData[] } routePoints
 * @returns { RoutePointModelData[] }
 */
const sortByDay = (routePoints) => {
  const routePointsCopy = [...routePoints];
  return routePointsCopy.sort((firstPoint, secondPoint) => {
    const firstPointDateFrom = dayjs(firstPoint.dateFrom);
    const secondPointDateFrom = dayjs(secondPoint.dateFrom);
    return firstPointDateFrom.diff(secondPointDateFrom, DATE_DIFFERENCE_UNIT);
  });
};

/**
 * Sorting by price
 * @param { RoutePointModelData[] } routePoints
 * @returns { RoutePointModelData[] }
 */
const sortByPrice = (routePoints) => {
  const routePointsCopy = [...routePoints];
  return routePointsCopy.sort((firstPoint, secondPoint) => {
    const firstPointPrice = firstPoint.basePrice;
    const secondPointPrice = secondPoint.basePrice;
    return secondPointPrice - firstPointPrice;
  });
};

/**
 * Sorting by time
 * @param { RoutePointModelData[] } routePoints
 * @returns { RoutePointModelData[] }
 */
const sortByTime = (routePoints) => {
  const routePointsCopy = [...routePoints];
  return routePointsCopy.sort((firstPoint, secondPoint) => {
    const firstPointDateFrom = dayjs(firstPoint.dateFrom);
    const secondPointDateFrom = dayjs(secondPoint.dateFrom);
    const firstPointDateTo = dayjs(firstPoint.dateTo);
    const secondPointDateTo = dayjs(secondPoint.dateTo);
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
 * @typedef { import('../model/route-model').RoutePointModelData } RoutePointModelData
 */
