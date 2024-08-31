import View from '../../../shared/view';
import { getCreateEventFormTemplate } from './template';

export default class CreateEventFormView extends View {
  constructor() {
    super(getCreateEventFormTemplate);
  }
}
