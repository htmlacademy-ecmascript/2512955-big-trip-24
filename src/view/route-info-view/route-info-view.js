import AbstractView from '../../framework/view/abstract-view';
import { getRouteInfoViewTemplate } from './template';

/**
 * Route info view
 * @extends AbstractView
 */
export default class RouteInfoView extends AbstractView {
  #routeTotalInfo = null;

  constructor({
    data
  }) {
    super();
    this.#routeTotalInfo = data;
  }

  get template() {
    return getRouteInfoViewTemplate(this.#routeTotalInfo);
  }
}
