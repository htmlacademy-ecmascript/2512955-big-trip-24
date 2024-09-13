import AbstractView from '../../framework/view/abstract-view';
import { getEventsListTemplate } from './template';

/**
 * Event list view
 * @extends AbstractView
 */
export default class EventsListView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return getEventsListTemplate();
  }
}
