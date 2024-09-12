import AbstractView from '../../../framework/view/abstract-view';
import { getListItemTemplate } from './template';

/**
 * Events list item view
 * @extends AbstractView
 */
export default class EventsListItemView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return getListItemTemplate();
  }
}
