import { dayjs } from '../utills/time';
import { FilterTypes } from '../config/filter-types';
import { DateFormats } from '../config/date-format';

/**
 * Default filter
 * @param { Date } date Now date
 * @param { RoutePointModelData[] } routePoints Route points data in model
 * @returns { RoutePointModelData[] } Filtered route points
 */
const everythingFilter = (date, routePoints) => routePoints;

/**
 * Future points filter
 * @param { Date } date Now date
 * @param { RoutePointModelData[] } routePoints Route points data in model
 * @returns { RoutePointModelData[] } Filtered route points
 */
const futureFilter = (date, routePoints) => {
  const nowDate = dayjs(date);

  return routePoints.filter((current) => {
    const { dateFrom } = current;
    const beginDate = dayjs(dateFrom);

    return beginDate.isAfter(nowDate);
  });
};

/**
 * Present points filter
 * @param { Date } date Now date
 * @param { RoutePointModelData[] } routePoints Route points data in model
 * @returns { RoutePointModelData[] } Filtered route points
 */
const presentFilter = (date, routePoints) => {
  const nowDate = dayjs(date, DateFormats.DATE_FORMAT);

  return routePoints.filter((current) => {
    const { dateFrom, dateTo } = current;
    const beginDate = dayjs(dateFrom);
    const endDate = dayjs(dateTo);

    return (beginDate.diff(nowDate) <= 0)
      && (endDate.diff(nowDate) >= 0);
  });
};

/**
 * Past points filter
 * @param { Date } date Now date
 * @param { RoutePointModelData[] } routePoints Route points data in model
 * @returns { RoutePointModelData[] } Filtered route points
 */
const pastFilter = (date, routePoints) => {
  const nowDate = dayjs(date);

  return routePoints.filter((current) => {
    const { dateTo } = current;
    const endDate = dayjs(dateTo);

    return endDate.isBefore(nowDate);
  });
};

/**
 * Filter type by filter function object
 * @type { FilterTypeByFunction }
 */
export const filterTypeByFunction = {
  [FilterTypes.EVERYTHING]: everythingFilter,
  [FilterTypes.FUTURE]: futureFilter,
  [FilterTypes.PAST]: pastFilter,
  [FilterTypes.PRESENT]: presentFilter
};

/**
 * @typedef { import('../model/route-model').RoutePointModelData } RoutePointModelData
 */

/**
 * @typedef { { [x: string]: (date: Date, routePoints: RoutePointModelData[]) => RoutePointModelData[] } } FilterTypeByFunction
 */
