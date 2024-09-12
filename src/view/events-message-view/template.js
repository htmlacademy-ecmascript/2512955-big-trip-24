/**
 * Get Message template
 * @param { string } message
 */
export const getEventsMessageTemplate = (message) => message
  ? `<p class="trip-events__msg">${message}</p>`
  : '';
