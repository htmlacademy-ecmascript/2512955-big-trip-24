import { getFiltersFormTemplate } from './template';
import View from '../../shared/view';

/**
 * Filters form view
 * @extends View<null>
 */
export default class EventsFilterFormView extends View {
  constructor() {
    super({
      getElementTemplate: getFiltersFormTemplate
    });
  }
}
