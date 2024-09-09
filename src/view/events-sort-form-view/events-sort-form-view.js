import View from '../../shared/view';
import { getEventsSortFormTemplate } from './template';

/**
 * Events form sort view
 * @extends View<null>
 */
export default class EventsSortFormView extends View {
  constructor() {
    super({
      getElementTemplate: getEventsSortFormTemplate
    });
  }
}
