import View from '../../../shared/view';
import { getEventInfoTemplate } from './template';

export default class EventInfoView extends View {
  constructor() {
    super(getEventInfoTemplate);
  }
}
