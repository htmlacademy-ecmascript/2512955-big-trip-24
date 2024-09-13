import { getEventInfoTemplate } from './template';
import AbstractView from '../../../framework/view/abstract-view';

/**
 * Event Info view component
 * @extends AbstractView
 */
export default class EventInfoView extends AbstractView {
  /**
   * Route point info
   * @type { RoutePointDto }
   */
  #routePoint = null;

  /**
   * User rollup button click callback
   * @type { OnRollupButtonClickCallback }
   */
  #onRollupButtonClick = null;

  /**
   * @param { ConstructorParams } params
   */
  constructor({ routePoint, onRollupButtonClick }) {
    super();

    this.#routePoint = routePoint;
    this.#onRollupButtonClick = onRollupButtonClick;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openEventButtonClick);
  }

  get template() {
    return getEventInfoTemplate({
      data: this.#routePoint
    });
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
