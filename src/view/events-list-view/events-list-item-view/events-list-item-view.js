import View from '../../../shared/view';
import { getListItemTemplate } from './template';

export default class EventsListItemView extends View {
  constructor() {
    super({
      getElementTemplate: getListItemTemplate
    });
  }
}
