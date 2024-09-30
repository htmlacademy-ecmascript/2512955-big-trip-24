/**
 * Get new event button template
 * @param { boolean } [disabled]
 * @returns { string }
 */
export const getNewEventButtonTemplate = (disabled = false) => {
  const disabledAttribute = disabled ? 'disabled' : '';
  return `
    <button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button" ${ disabledAttribute }>
      New event
    </button>`;
};
