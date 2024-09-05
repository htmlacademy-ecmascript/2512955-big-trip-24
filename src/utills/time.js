/**
 * @typedef { Object } TimePartsObject
 * @property { number } TimePartsObject.days
 * @property { number } TimePartsObject.hours
 * @property { number } TimePartsObject.minutes
 */

const MINUTES_IN_ONE_HOUR = 60;
const HOURS_IN_ONE_DAY = 24;

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
