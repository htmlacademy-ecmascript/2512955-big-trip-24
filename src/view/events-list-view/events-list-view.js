import View from '../../shared/view';
import { getEventsListTemplate } from './template';

/**
 * Event list view
 * @extends View<null>
 */
export default class EventsListView extends View {
  constructor() {
    super({
      getElementTemplate: getEventsListTemplate
    });
  }
}
