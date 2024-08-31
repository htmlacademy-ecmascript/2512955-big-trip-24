import View from '../../shared/view';
import { getNewEventButtonTemplate } from './template';

export default class NewEventButtonView extends View {
  constructor() {
    super(getNewEventButtonTemplate);
  }
}
