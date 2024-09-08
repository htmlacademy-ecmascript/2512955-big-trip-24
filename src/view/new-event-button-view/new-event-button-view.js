import View from '../../shared/view';
import { getNewEventButtonTemplate } from './template';

/**
 * New event button view
 * @extends View<null>
 */
export default class NewEventButtonView extends View {
  constructor() {
    super({
      getElementTemplate: getNewEventButtonTemplate
    });
  }
}
