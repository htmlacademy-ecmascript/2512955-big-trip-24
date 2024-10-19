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
   * @type { OnFavoriteButtonClickCallback }
   */
  #onFavoriteButtonClickCallback = null;

  /**
   * @param { ConstructorParams } params
   */
  constructor({ routePoint, onRollupButtonClick, onFavoriteButtonClickCallback }) {
    super();

    this.#routePoint = routePoint;
    this.#onRollupButtonClick = onRollupButtonClick;
    this.#onFavoriteButtonClickCallback = onFavoriteButtonClickCallback;
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#openEventButtonClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favoriteButtonClickHandler);
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
  #openEventButtonClickHandler = (event) => {
    event.preventDefault();
    this.#onRollupButtonClick();
  };

  /**
   * Open button click handler
   * @param { Event } event
   */
  #favoriteButtonClickHandler = (event) => {
    event.preventDefault();
    this.#onFavoriteButtonClickCallback()
      .catch(() => this.shake());
  };
}

/**
 * @typedef { import('../../../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { Object } ConstructorParams
 * @property { RoutePointDto } ConstructorParams.routePoint
 * @property { OnRollupButtonClickCallback } ConstructorParams.onRollupButtonClick
 * @property { OnFavoriteButtonClickCallback } ConstructorParams.onFavoriteButtonClickCallback
 */

/**
 * @callback OnRollupButtonClickCallback
 * @returns { void }
 */

/**
 * @callback OnFavoriteButtonClickCallback
 * @returns { Promise<void> }
 */
