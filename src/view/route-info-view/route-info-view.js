import View from '../../shared/view';
import { getRouteInfoViewTemplate } from './template';

export default class RouteInfoView extends View {
  constructor() {
    super(getRouteInfoViewTemplate);
  }
}
