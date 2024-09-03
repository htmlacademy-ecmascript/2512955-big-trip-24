import View from '../../shared/view';
import { getEventsSortFormTemplate } from './template';

export default class EventsSortFormView extends View {
  constructor() {
    super({
      getElementTemplate: getEventsSortFormTemplate
    });
  }
}
