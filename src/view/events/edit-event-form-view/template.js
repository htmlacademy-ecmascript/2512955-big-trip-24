import { dayjs } from '../../../utills/time';
import { RoutePointsTypes } from '../../../config/route-points-types';
import { DateFormats } from '../../../config/date-format';

/**
 * Get event types fieldset
 * @param { RoutePointsTypes } selectedType
 * @param { Nullable<string> } eventId
 * @returns { string }
 */
const getEventTypeFieldSetTemplate = (selectedType, eventId) => {
  const allPointsTypes = Object.values(RoutePointsTypes);

  /**
   * Render one option
   * @param { RoutePointsTypes } pointType
   * @returns { string }
   */
  const renderPointType = (pointType) => {
    const checkedAttribute = pointType === selectedType ? 'checked' : '';

    return `
      <div class="event__type-item">
        <input id="event-type-${ pointType }-${ eventId }" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${ pointType }" ${ checkedAttribute }>
        <label class="event__type-label  event__type-label--${ pointType }" for="event-type-${ pointType }-${ eventId }">${ pointType }</label>
      </div>`;
  };

  return `
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>
      ${ allPointsTypes.map(renderPointType).join('') }
    </fielset>
  `;
};

/**
 * Get destinations select template
 * @param { DestinationDto[] } allDestinations
 * @param { Nullable<string> } eventId
 * @returns { string }
 */
const getDestinationSelectTemplate = (allDestinations, eventId) => {
  /**
   * One option render
   * @param { DestinationDto } option
   * @returns { string }
   */
  const renderDestinationOption = (option) => `<option value="${ option.name }"></option>`;

  return allDestinations?.length
    ? `<datalist id="destination-list-${ eventId }">
        ${allDestinations.map(renderDestinationOption).join('')}
      </datalist>`
    : '';
};

/**
 * Get point timeline template
 * @param { { dateFrom: Nullable<string>, dateTo: Nullable<string>, id: Nullable<string> } } params
 * @returns
 */
const getPointTimeLineTemplate = ({ dateFrom, dateTo, id }) => {
  const eventBegin = dayjs(dateFrom);
  const eventEnd = dayjs(dateTo);
  const eventBeginValue = dateFrom ? eventBegin.format(DateFormats.TIMELINE_INPUT_FORMAT) : '';
  const eventEndValue = dateTo ? eventEnd.format(DateFormats.TIMELINE_INPUT_FORMAT) : '';
  return `
    <div class="event__field-group  event__field-group--time">
      <label class="visually-hidden" for="event-start-time-${ id }">From</label>
      <input class="event__input  event__input--time" id="event-start-time-${ id }" type="text" name="event-start-time" value="${ eventBeginValue }">
      &mdash;
      <label class="visually-hidden" for="event-end-time-${ id }">To</label>
      <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${ eventEndValue }">
    </div>`;
};

/**
 * @typedef { Object } GetEventPriceParams
 * @property { Nullable<string> } GetEventPriceParams.id
 * @property { number } [GetEventPriceParams.basePrice=0]
 */

/**
 * Get event price input template
 * @param { GetEventPriceParams } params
 * @returns { string }
 */
const getEventPriceInputTemplate = ({ id, basePrice = 0 }) => `
  <div class="event__field-group  event__field-group--price">
    <label class="event__label" for="event-price-${ id }">
      <span class="visually-hidden">Price</span>
      &euro;
    </label>
    <input class="event__input  event__input--price" id="event-price-${ id }" type="text" name="event-price" value="${ basePrice }">
  </div>`;

/**
 * Get offers section template
 * @param { OfferDto[] } eventOffers
 * @param { OfferDto[] } fullOffers
 * @returns { string }
 */
const getEventOffersTemplate = (eventOffers, fullOffers) => {
  /**
   * One offer render
   * @param { OfferDto } offer
   * @returns { string }
   */
  const renderOffer = (offer) => {
    const offerCheckedAttribute = eventOffers.some((current) => current.id === offer.id) ? 'checked' : '';
    const offerIdDataSet = `data-offer-id="${ offer.id }"`;
    return `
    <div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${ offer.id }" ${ offerIdDataSet } type="checkbox" name="event-offer-luggage" ${ offerCheckedAttribute }>
      <label class="event__offer-label" for="event-offer-luggage-${ offer.id }">
        <span class="event__offer-title">${ offer.title }</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${ offer.price }</span>
      </label>
    </div>`;
  };

  return fullOffers?.length
    ? `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${ fullOffers.map(renderOffer).join('') }
        </div>
      </section>`
    : '';
};

/**
 * Get Photos section template
 * @param { DestinationPictureDto[] } photos
 * @returns { string }
 */
export const getEventPhotosTemplate = (photos) => {
  /**
   * Get photo template
   * @param { DestinationPictureDto } photo
   * @returns { string }
   */
  const renderPhoto = (photo) => `<img class="event__photo" src="${ photo.src }" alt="${ photo.description }">`;

  return photos?.length
    ? `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${ photos.map(renderPhoto).join('') }
        </div>
      </div>`
    : '';
};

/**
 * Get EditForm template
 * @param { EditEventFormViewState } state
 * @returns { string }
 */
export const getEditEventTemplate = ({ fullDestinations, fullOffers, ...data }) => {
  const {
    id,
    type,
    destination,
    offers,
    basePrice,
    dateFrom,
    dateTo
  } = data;

  const cancelButtonDescription = id ? 'Delete' : 'Cancel';

  const destinationTemplate = destination
    ? `<section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${ destination?.description ?? '' }</p>
        ${ getEventPhotosTemplate(destination?.pictures) }
          </section>`
    : '';

  return `
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${ id }">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${ type }.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${ id }" type="checkbox">

          <div class="event__type-list">
            ${ getEventTypeFieldSetTemplate(type, id) }
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${ id }">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-${ id }" type="text" name="event-destination" value="${ destination?.name ?? '' }" list="destination-list-${ id }">
          ${getDestinationSelectTemplate(fullDestinations, id)}
        </div>

        ${ getPointTimeLineTemplate({ id, dateFrom, dateTo }) }
        ${ getEventPriceInputTemplate({ id, basePrice }) }

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${cancelButtonDescription}</button>
        ${ id && `
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>` }
      </header>
      <section class="event__details">
        ${ getEventOffersTemplate(offers, fullOffers, id) }
        ${ destinationTemplate }
      </section>
    </form>
  `;
};

/**
 * @typedef { import('../../../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { import('../../../service/data-transfer-object-service').DestinationDto } DestinationDto
 */

/**
 * @typedef { import('../../../service/data-transfer-object-service').DestinationPictureDto } DestinationPictureDto
 */

/**
 * @typedef { import('../../../service/data-transfer-object-service').OfferDto } OfferDto
 */

/**
 * @typedef { import('../../../config/route-points-types').RoutePointsTypes } RoutePointsTypes
 */

/**
 * @template TSourceType
 * @typedef { TSourceType | null } Nullable
 */

/**
 * @typedef { import('./edit-event-form-view').EditEventFormViewState } EditEventFormViewState
 */
