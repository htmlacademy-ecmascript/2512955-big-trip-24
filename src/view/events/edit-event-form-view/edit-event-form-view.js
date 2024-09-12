import AbstractView from '../../../framework/view/abstract-view';
import { getEditEventTemplate } from './template';

/**
 * @extends AbstractView
 */
export default class EditEventFormView extends AbstractView {
  /**
   * Editted route point
   * @type { RoutePointDto }
   */
  #routePoint = null;

  /**
   * @type { GetOffersCallback }
   */
  #getOffersCallback = null;

  /**
   * @type { GetDestinationsCallback }
   */
  #getDestinationsCallback = null;

  /**
   * @type { OnCloseElementClickCallback }
   */
  #onRollupButtonClickCallback = null;

  /**
   * @type { OnSaveButtonClickCallback }
   */
  #onSaveButtonClickCallback = null;

  /**
   * EditEventFormView constructor
   * @param { EditFormViewConstructorParams } params
   */
  constructor({
    routePoint,
    getOffers,
    getDestinations,
    onRollupButtonClick,
    onSaveButtonClick
  }) {
    super();
    this.#onSaveButtonClickCallback = onSaveButtonClick;
    this.#routePoint = routePoint;
    this.#getDestinationsCallback = getDestinations;
    this.#getOffersCallback = getOffers;

    if (routePoint.id && onRollupButtonClick) {
      this.#onRollupButtonClickCallback = onRollupButtonClick;
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onRollupButtonClick);
    }

    this.element.addEventListener('submit', this.#onSubmitForm);
  }

  get template() {
    return getEditEventTemplate({
      data: this.#routePoint,
      getDestinations: this.#getDestinationsCallback,
      getOffers: this.#getOffersCallback
    });
  }

  /**
   * Submit form handler
   * @param { SubmitEvent } event
   */
  #onSubmitForm = (event) => {
    event.preventDefault();
    this.#onSaveButtonClickCallback();
  };

  /**
   * Close element click handler
   * @param { Event } event
   */
  #onRollupButtonClick = (event) => {
    event.preventDefault();
    this.#onRollupButtonClickCallback();
  };
}

/**
 * @typedef { Object } EditFormViewConstructorParams
 * @property { RoutePointDto } EditFormViewConstructorParams.routePoint
 * @property { GetOffersCallback } EditFormViewConstructorParams.getOffers
 * @property { GetDestinationsCallback } EditFormViewConstructorParams.getDestinations
 * @property { OnRollupButtonClickCallback } [EditFormViewConstructorParams.onRollupButtonClick=null]
 * @property { OnSaveButtonClickCallback } EditFormViewConstructorParams.onSaveButtonClick
 */

/**
 * @callback GetOffersCallback
 * @param { RoutePointsTypes } eventType
 * @returns { OfferDto[] }
 */

/**
 * @callback GetDestinationsCallback
 * @returns { DestinationDto[] }
 */

/**
 * @callback OnRollupButtonClickCallback
 * @returns { void }
 */

/**
 * @callback OnSaveButtonClickCallback
 * @returns { void }
 */

/**
 * @typedef { import('../../../config/route-points-types').RoutePointsTypes } RoutePointsTypes
 */

/**
 * @typedef { import('../../../service/data-transfer-object-service').OfferDto } OfferDto
 */

/**
 * @typedef { import('../../../service/data-transfer-object-service').DestinationDto } DestinationDto
 */

/**
 * @typedef { import('../../../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */
