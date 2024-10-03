import AbstractView from '../../framework/view/abstract-view';
import { getNewEventButtonTemplate } from './template';

/**
 * New event button view
 * @extends AbstractView
 */
export default class NewEventButtonView extends AbstractView {
  /**
   * @type { () => void }
   */
  #onClickCallback = null;

  /**
   * @param { ViewConstructorParams } params
   */
  constructor({ onClick }) {
    super();
    this.#onClickCallback = onClick;
    this.element.addEventListener('click', this.#newEventButtonClickHandler);
  }

  /**
   * @param { Event } event
   */
  #newEventButtonClickHandler = (event) => {
    event.preventDefault();
    this.#onClickCallback();
  };

  get template() {
    return getNewEventButtonTemplate();
  }
}

/**
 * @typedef { Object } ViewConstructorParams
 * @property { boolean } [ViewConstructorParams.disabled]
 * @property { () => void } ViewConstructorParams.onClick
 */
