import View from '../../../shared/view';
import { getEventInfoTemplate } from './template';

/**
 * Event Info view component
 * @extends View<RoutePointDto>
 */
export default class EventInfoView extends View {
  /**
   * User rollup button click callback
   * @type { OnRollupButtonClickCallback }
   */
  #onRollupButtonClick = null;

  /**
   * @param { ConstructorParams } params
   */
  constructor({ routePoint, onRollupButtonClick }) {
    super({
      getElementTemplate: getEventInfoTemplate,
      data: routePoint
    });

    this.#onRollupButtonClick = onRollupButtonClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openEventButtonClick);
  }

  /**
   * Open button click handler
   * @param { Event } event
   */
  #openEventButtonClick = (event) => {
    event.preventDefault();
    this.#onRollupButtonClick();
  };
}

/**
 * @typedef { import('../../../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { Object } ConstructorParams
 * @property { RoutePointDto } ConstructorParams.routePoint
 * @property { OnRollupButtonClickCallback } ConstructorParams.onRollupButtonClick
 */

/**
 * @callback OnRollupButtonClickCallback
 * @returns { void }
 */
