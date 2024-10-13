import dayjsLib from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjsLib.extend(utc);
dayjsLib.extend(timezone);
dayjsLib.tz.setDefault('GMT');
const dayjs = dayjsLib.utc;

const MINUTES_IN_ONE_HOUR = 60;
const HOURS_IN_ONE_DAY = 24;
const MILLISECONDS_IN_ONE_MINUTE = 60000;

/**
 * Get TimePartsObject by minutes
 * @param { number } minutes
 * @returns { TimePartsObject }
 */
export const getTimePartsByMinutes = (minutes) => {
  const partMinutes = minutes % MINUTES_IN_ONE_HOUR;
  const partHours = (minutes - partMinutes) / MINUTES_IN_ONE_HOUR;
  const hoursRemainder = partHours % HOURS_IN_ONE_DAY;
  const partDays = (partHours - hoursRemainder) / HOURS_IN_ONE_DAY;

  return {
    days: partDays,
    hours: hoursRemainder,
    minutes: partMinutes
  };
};

/**
 * Local to UTC
 * @param { Date } date - Local date
 * @returns { Date }
 */
export const flatpickrDateToUTCDate = (date) => {
  const dateTest = dayjsLib(date);
  return dateTest.add((dateTest.utcOffset() * MILLISECONDS_IN_ONE_MINUTE), 'millisecond').toDate();
};

/**
 * UTC to Local
 * @param { string } date - UTC date
 * @returns { Date }
 */
export const flatpickrUTCDateParser = (date) => {
  const dateTest = dayjsLib(date);
  return dateTest.add((dateTest.utcOffset() * MILLISECONDS_IN_ONE_MINUTE * (-1)), 'millisecond').toDate();
};


export {
  dayjs,
};

/**
 * @typedef { Object } TimePartsObject
 * @property { number } TimePartsObject.days
 * @property { number } TimePartsObject.hours
 * @property { number } TimePartsObject.minutes
 */
