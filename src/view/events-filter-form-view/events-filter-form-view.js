import { getFiltersFormTemplate } from './template';
import View from '../../shared/view';

export default class EventsFilterFormView extends View {
  constructor() {
    super({
      getElementTemplate: getFiltersFormTemplate
    });
  }
}
