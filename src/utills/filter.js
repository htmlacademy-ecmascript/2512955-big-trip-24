import dayjs from 'dayjs';
import { FilterTypes } from '../config/filter-types';
import { DateFormats } from '../config/date-format';

/**
 * Default filter
 * @param { Date } date Now date
 * @param { RoutePointData[] } routePoints Route points data in model
 * @returns { RoutePointData[] } Filtered route points
 */
const everythingFilter = (date, routePoints) => routePoints;

/**
 * Future points filter
 * @param { Date } date Now date
 * @param { RoutePointData[] } routePoints Route points data in model
 * @returns { RoutePointData[] } Filtered route points
 */
const futureFilter = (date, routePoints) => {
  const nowDate = dayjs(date, DateFormats.DATE_FORMAT);

  return routePoints.filter((current) => {
    const { date_from: dateFrom } = current;
    const beginDate = dayjs(dateFrom, DateFormats.DATE_FORMAT);

    return beginDate.isAfter(nowDate);
  });
};

/**
 * Present points filter
 * @param { Date } date Now date
 * @param { RoutePointData[] } routePoints Route points data in model
 * @returns { RoutePointData[] } Filtered route points
 */
const presentFilter = (date, routePoints) => {
  const nowDate = dayjs(date, DateFormats.DATE_FORMAT);

  return routePoints.filter((current) => {
    const { date_from: dateFrom, date_to: dateTo } = current;
    const beginDate = dayjs(dateFrom, DateFormats.DATE_FORMAT);
    const endDate = dayjs(dateTo, DateFormats.DATE_FORMAT);

    return (beginDate.diff(nowDate) <= 0)
      && (endDate.diff(nowDate) >= 0);
  });
};

/**
 * Past points filter
 * @param { Date } date Now date
 * @param { RoutePointData[] } routePoints Route points data in model
 * @returns { RoutePointData[] } Filtered route points
 */
const pastFilter = (date, routePoints) => {
  const nowDate = dayjs(date, DateFormats.DATE_FORMAT);

  return routePoints.filter((current) => {
    const { date_to: dateTo } = current;
    const endDate = dayjs(dateTo, DateFormats.DATE_FORMAT);

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
 * @typedef { import('../model/route-model').RoutePointData } RoutePointData
 */

/**
 * @typedef { { [x: string]: (date: Date, routePoints: RoutePointData[]) => RoutePointData[] } } FilterTypeByFunction
 */
