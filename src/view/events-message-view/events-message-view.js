import AbstractView from '../../framework/view/abstract-view';
import { getEventsMessageTemplate } from './template';

export default class EventsMessageView extends AbstractView {
  #message = null;

  /**
   * @param { EventsMessageConstructorParams } params
   */
  constructor({ message }) {
    super();
    this.#message = message;
  }

  get template() {
    return getEventsMessageTemplate(this.#message);
  }
}

/**
 * @typedef { { message: string } } EventsMessageConstructorParams
 */
