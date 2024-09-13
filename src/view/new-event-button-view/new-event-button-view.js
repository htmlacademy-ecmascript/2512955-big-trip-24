import AbstractView from '../../framework/view/abstract-view';
import { getNewEventButtonTemplate } from './template';

/**
 * New event button view
 * @extends AbstractView
 */
export default class NewEventButtonView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return getNewEventButtonTemplate();
  }
}
