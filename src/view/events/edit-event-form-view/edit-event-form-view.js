import { getEditEventTemplate } from './template';
import { OFFER_INPUT_NAME, DATES_RANGE_LENGTH, DEFAULT_PARSE_RADIX } from './const';
import flatpickr from 'flatpickr';
import { DateFormats } from '../../../config/date-format';
import { flatpickrUTCDateParser, flatpickrDateToUTCDate } from '../../../utills/time';
import EncodedStatefulView from '../../../shared/encoded-stateful-view';

/**
 * @extends EncodedStatefulView
 */
export default class EditEventFormView extends EncodedStatefulView {
  #isNewEvent = false;
  /**
   * @type { FlatpickrInstance }
   */
  #dateFromPicker = null;
  /**
   * @type { FlatpickrInstance }
   */
  #dateToPicker = null;
  /**
   * @type { GetOffersCallback }
   */
  #getOffersCallback = null;

  /**
   * @type { OnCloseElementClickCallback }
   */
  #onRollupButtonClickCallback = null;

  /**
   * @type { OnSubmitCallback }
   */
  #onSubmitCallback = null;

  /**
   * @type { OnDeleteCallback }
   */
  #onDeleteCallback = null;

  /**
   * EditEventFormView constructor
   * @param { EditFormViewConstructorParams } params
   */
  constructor({
    routePoint,
    getOffers,
    getDestinations,
    onRollupButtonClick,
    onSubmit,
    onDelete
  }) {
    super();
    this.#onSubmitCallback = onSubmit;
    this.#getOffersCallback = getOffers;
    this.#onDeleteCallback = onDelete;
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
  #destinationSelectHandler = (event) => {
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
  #eventTypeChangeHandler = (event) => {
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
   * @param { Event } event
   */
  #deleteButtonClickHandler = (event) => {
    event.preventDefault();
    this.#onDeleteCallback(EditEventFormView.convertStateToData(this._state));
    this.#destroyFlatPickers();
  };

  /**
   * Submit form handler
   * @param { SubmitEvent } event
   */
  #submitFormHandler = (event) => {
    event.preventDefault();
    this.#onSubmitCallback(EditEventFormView.convertStateToData(this._state));
    this.#destroyFlatPickers();
  };

  /**
   * Close element click handler
   * @param { Event } event
   */
  #rollupButtonClickHandler = (event) => {
    event.preventDefault();
    this.#onRollupButtonClickCallback();
    this.#destroyFlatPickers();
  };

  #priceInputBlurHandler = (event) => {
    event.preventDefault();
    this.updateElement({
      basePrice: /^\d*$/.test(event.target.value) ? Number.parseInt(event.target.value, DEFAULT_PARSE_RADIX) : this._state.basePrice
    });
  };

  #offerInputChangeHandler = (event) => {
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

  /**
   * Dates change handler
   * @param { Date[] } dates - Selected dates
   * @param { string } _representation - Flatpickr default dates serializing
   * @param { FlatpickrInstance } instance - Flatpickr object
   */
  #dateSelectHandler = (dates, _representation, instance) => {
    if (dates.length === DATES_RANGE_LENGTH) {
      const [date] = dates;
      const stateField = instance === this.#dateFromPicker ? 'dateFrom' : 'dateTo';
      date.setMilliseconds(new Date(this._state[stateField]).getMilliseconds());
      const utcDateValue = flatpickrDateToUTCDate(date).toISOString();
      if (this._state[stateField] !== utcDateValue) {
        this.updateElement({
          [stateField]: utcDateValue,
        });
      }
    }
  };

  _restoreHandlers() {
    this.#setFlatPickers();

    this.element.addEventListener('submit', this.#submitFormHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#eventTypeChangeHandler);

    this.element.querySelector('.event__input--destination').addEventListener('blur', this.#destinationSelectHandler);

    if (this._state.fullOffers?.length ?? 0 > 0) {
      this.element.querySelector('.event__section--offers').addEventListener('change', this.#offerInputChangeHandler);
    }

    if (!this.#isNewEvent) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupButtonClickHandler);
    }

    this.element.querySelector('.event__input--price').addEventListener('blur', this.#priceInputBlurHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deleteButtonClickHandler);
  }

  #destroyFlatPickers() {
    this.#dateFromPicker?.destroy();
    this.#dateToPicker?.destroy();
  }

  #setFlatPickers() {
    this.#destroyFlatPickers();
    this.#dateToPicker = flatpickr(
      this.element.querySelector(`#event-end-time-${this._state.id}`),
      {
        onClose: this.#dateSelectHandler,
        dateFormat: DateFormats.FLATPICKR_FORMAT,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        parseDate: flatpickrUTCDateParser,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        enableTime: true,
      }
    );

    this.#dateFromPicker = flatpickr(
      this.element.querySelector(`#event-start-time-${this._state.id}`),
      {
        onClose: this.#dateSelectHandler,
        dateFormat: DateFormats.FLATPICKR_FORMAT,
        defaultDate: this._state.dateFrom,
        maxDate: this._state.dateTo,
        parseDate: flatpickrUTCDateParser,
        // eslint-disable-next-line camelcase
        time_24hr: true,
        enableTime: true
      }
    );
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
 * @property { OnSubmitCallback } EditFormViewConstructorParams.onSubmit
 * @property { OnDeleteCallback } EditFormViewConstructorParams.onDelete
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
 * @callback OnSubmitCallback
 * @param { RoutePointDto } routePoint
 * @returns { void }
 */

/**
 * @callback OnDeleteCallback
 * @param { RoutePointDto } routePoint
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

/**
 * @typedef { import('flatpickr/dist/types/instance').Instance } FlatpickrInstance
 */
