import View from '../../shared/view';
import { getRouteInfoViewTemplate } from './template';

/**
 * Route info view
 * @extends View<null>
 */
export default class RouteInfoView extends View {
  constructor() {
    super({
      getElementTemplate: getRouteInfoViewTemplate
    });
  }
}
