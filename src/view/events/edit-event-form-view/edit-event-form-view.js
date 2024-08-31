import View from '../../../shared/view';
import { getEditEventTemplate } from './template';

export default class EditEventFormView extends View {
  constructor() {
    super(getEditEventTemplate);
  }
}
