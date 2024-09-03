import dayjs from 'dayjs';
import { getTimePartsByMinutes } from '../../../utills/time';
import { DateFormats } from '../../../config/date-format';

const getEventLengthString = ({days, hours, minutes}) => {
  let result = '';

  const concatTimePart = (value, unit) => {
    if (value > 0) {
      result = `${result} ${value}${unit.toUpperCase()}`;
    }
  };

  concatTimePart(days, 'd');
  concatTimePart(hours, 'h');
  concatTimePart(minutes, 'm');

  return result.trim();
};

const getEventSheduleTemplate = ({ eventBegin, eventEnd }) => {
  const eventLength = getTimePartsByMinutes(eventEnd.diff(eventBegin, 'minute'));
  return `
    <div class="event__schedule">
      <p class="event__time">
        <time class="event__start-time" datetime="${ eventBegin.format(DateFormats.DATETIME_FORMAT) }">${ eventBegin.format(DateFormats.TIME_FORMAT) }</time>
        &mdash;
        <time class="event__end-time" datetime="${ eventEnd.format(DateFormats.DATETIME_FORMAT) }">${ eventEnd.format(DateFormats.TIME_FORMAT) }</time>
      </p>
      <p class="event__duration">${getEventLengthString(eventLength)}</p>
    </div>
  `;
};

const getOffersListTemplate = (offers = []) => {
  const renderOffer = ({ title, price }) => `
    <li class="event__offer">
      <span class="event__offer-title">${ title }</span>
      +&euro;&nbsp;
      <span class="event__offer-price">${ price }</span>
    </li>`;

  return offers.length > 0
    ? `<ul class="event__selected-offers">
        ${offers.map(renderOffer).join('')}
      </ul>`
    : '';
};

export const getEventInfoTemplate = ({ data }) => {
  const {
    destination,
    type,
    base_price : price,
    date_to : endDate,
    date_from : beginDate,
    offers,
    is_favorite: isFavorite
  } = data;
  const eventBegin = dayjs(beginDate);
  const eventEnd = dayjs(endDate);
  const isFavoriteEventActiveClassName = isFavorite ? 'event__favorite-btn--active' : '';
  return `
    <div class="event">
      <time class="event__date" datetime="${ eventBegin.format(DateFormats.DATE_FORMAT) }">${ eventBegin.format(DateFormats.DAY_FORMAT).replace(':', ' ') }</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${ type }.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${ type } ${ destination.name }</h3>
      ${ getEventSheduleTemplate({ eventBegin, eventEnd }) }
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${ price }</span>
      </p>
      <h4 class="visually-hidden">Offers:</h4>
      ${ getOffersListTemplate(offers) }
      <button class="event__favorite-btn ${ isFavoriteEventActiveClassName }" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"></path>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>`;
};
