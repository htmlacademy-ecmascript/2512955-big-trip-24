import AbstractStatefulView from '../../../framework/view/abstract-stateful-view';
import { getEditEventTemplate } from './template';
import { OFFER_INPUT_NAME } from './const';

/**
 * @extends AbstractStatefulView
 */
export default class EditEventFormView extends AbstractStatefulView {
  #isNewEvent = false;

  /**
   * @type { GetOffersCallback }
   */
  #getOffersCallback = null;

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
    this.#getOffersCallback = getOffers;
    this._setState(EditEventFormView.convertDataToState(routePoint, getOffers(routePoint.type), getDestinations()));
    this.#isNewEvent = !(routePoint.id && onRollupButtonClick);

    if (!this.#isNewEvent) {
      this.#onRollupButtonClickCallback = onRollupButtonClick;
    }
    this._restoreHandlers();
  }

  get template() {
    return getEditEventTemplate(this._state);
  }

  /**
   * Event destination change handler
   * @param { Event } event
   */
  #onDestinationSelect = (event) => {
    const destinationName = event.target?.value?.toLowerCase();

    let findedDestination = this._state
      .fullDestinations.find((current) => current.name.toLowerCase() === destinationName);

    if (!findedDestination) {
      findedDestination = this._state
        .fullDestinations.find((current) => current.name.toLowerCase().includes(destinationName));
    }

    this.updateElement({
      destination: findedDestination ? findedDestination : null,
    });
  };

  /**
   * Event type change handler
   * @param { Event } event
   */
  #onEventTypeChange = (event) => {
    event.preventDefault();
    const newEventType = event.target?.value ?? this._state.type;

    if (newEventType !== this._state.type && event.target?.checked) {
      this.updateElement({
        offers: [],
        fullOffers: this.#getOffersCallback(newEventType),
        type: newEventType
      });
    }
  };

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

  #onOfferInputChange = (event) => {
    event.preventDefault();
    const element = event.target;

    if (element?.name === OFFER_INPUT_NAME) {
      const offerId = element.dataset.offerId;
      const offer = this._state.fullOffers.find((current) => current.id === offerId);

      if (offer) {
        this.updateElement({
          offers: element?.checked ? [...this._state.offers, offer] : this._state.offers.filter((current) => current.id !== offer.id)
        });
      }
    }
  };

  _restoreHandlers() {
    this.element.addEventListener('submit', this.#onSubmitForm);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#onEventTypeChange);

    this.element.querySelector('.event__input--destination').addEventListener('blur', this.#onDestinationSelect);
    this.element.querySelector('.event__section--offers').addEventListener('change', this.#onOfferInputChange);
    if (!this.#isNewEvent) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onRollupButtonClick);
    }
  }

  /**
   * Data to state converter
   * @param { RoutePointDto } data
   * @param { OfferDto[] } fullOffers
   * @param { DestinationDto[] } fullDestinations
   * @returns { EditEventFormViewState }
   */
  static convertDataToState(data, fullOffers, fullDestinations) {
    return {
      ...data,
      fullDestinations,
      fullOffers
    };
  }

  /**
   * State to data converter
   * @param { EditEventFormViewState } state
   * @returns { RoutePointDto }
   */
  static convertStateToData(state) {
    const dataObject = {
      ...state
    };

    delete dataObject.fullDestinations;
    delete dataObject.fullOffers;

    return dataObject;
  }
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
 * @typedef { Object } EditEventFormViewAdditionalState
 * @property { OfferDto[] } EditEventFormViewAdditionalState.fullOffers
 * @property { DestinationDto[] } EditEventFormViewAdditionalState.fullDestinations
 */

/**
 * @typedef { RoutePointDto & EditEventFormViewAdditionalState } EditEventFormViewState
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
