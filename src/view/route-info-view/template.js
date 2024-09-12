import dayjs from 'dayjs';
import { DateFormats } from '../../config/date-format';

const MAX_DESTINATION_COUNT_FOR_FULL_OUTPUT = 3;

/**
 * Get header template
 * @param { RouteTotalsDto } params
 * @returns { string }
 */
const getHeaderTemplate = ({ destinationNames }) => {
  if (destinationNames.length > 0) {
    let description;

    if (destinationNames.length <= MAX_DESTINATION_COUNT_FOR_FULL_OUTPUT) {
      description = destinationNames.join('&nbsp;&mdash;&nbsp;');
    } else {
      description = `${ destinationNames[0] }&nbsp;&mdash;&nbsp;...&nbsp;&mdash;&nbsp;${ destinationNames[destinationNames.length - 1] }`;
    }

    return `
      <h1 class="trip-info__title">
        ${ description }
      </h1>`;
  }

  return '';
};

/**
 * Get route totals view
 * @param { RouteTotalsDto | null } data
 * @returns { string }
 */
export const getRouteInfoViewTemplate = (data) => {
  if (!data) {
    return '';
  }

  const dateFrom = dayjs(data.dateFrom);
  const dateTo = dayjs(data.dateTo);
  return `
    <section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        ${ getHeaderTemplate(data) }
        <p class="trip-info__dates">
          ${ dateFrom.format(DateFormats.DAY_MONTH_FORMAT).replace(':', ' ') }
          &nbsp;&mdash;&nbsp;
          ${ dateTo.format(DateFormats.DAY_MONTH_FORMAT).replace(':', ' ') }
        </p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${ data.totalPrice }</span>
      </p>
    </section>`;
};

/**
 * @typedef { import('../../service/data-transfer-object-service').RouteTotalsDto } RouteTotalsDto
 */
