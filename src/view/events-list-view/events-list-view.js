import View from '../../shared/view';
import { getEventsListTemplate } from './template';

export default class EventsListView extends View {
  constructor() {
    super(getEventsListTemplate);
  }
}
