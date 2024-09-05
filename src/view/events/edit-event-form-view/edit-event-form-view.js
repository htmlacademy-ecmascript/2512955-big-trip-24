import View from '../../../shared/view';
import { getEditEventTemplate } from './template';

export default class EditEventFormView extends View {
  #getOffers = null;
  #getDestinations = null;

  constructor({ routePoint, getOffers, getDestinations }) {

    super({
      getElementTemplate: ({ data }) => getEditEventTemplate({ data, getOffers, getDestinations }),
      data: routePoint
    });

    this.#getOffers = getOffers;
    this.#getDestinations = getDestinations;
  }
}
