import View from '../../../shared/view';
import { getListItemTemplate } from './template';

/**
 * Events list item view
 * @extends View<null>
 */
export default class EventsListItemView extends View {
  constructor() {
    super({
      getElementTemplate: getListItemTemplate
    });
  }
}
