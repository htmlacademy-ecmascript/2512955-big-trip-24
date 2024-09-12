import Presenter from '../shared/presenter';
import RouteInfoView from '../view/route-info-view';
import {
  render,
  RenderPosition
} from '../framework/render';
import DataTransferObjectService from '../service/data-transfer-object-service';

export default class HeaderPresenter extends Presenter {
  /**
   * @type { RouteInfoView }
   */
  #routeInfoView = null;

  /**
   * Header root element
   * @type { HTMLElement }
   */
  #rootElement = null;

  /**
   * Header presenter constructor
   * @param { HeaderPresenterConstructorParams } presenterParams
   */
  constructor({ headerRootElement, ...presenterParams }) {
    super(presenterParams);
    this.#rootElement = headerRootElement;
  }

  #renderViews() {
    const routeTotalInfo = DataTransferObjectService.getFullRouteInfoDto(
      this._routeModel.getFullRouteInfo(),
      this._offerModel.getAllOffers(),
      this._routeDestinationModel.data
    );

    if (routeTotalInfo) {
      this.#routeInfoView = new RouteInfoView({ data: routeTotalInfo });
      render(this.#routeInfoView, this.#rootElement, RenderPosition.AFTERBEGIN);
    }
  }

  init() {
    this.#renderViews();
  }
}

/**
 * @typedef { import('../shared/presenter').PresenterConstructorParams } PresenterConstructorParams
 */

/**
 * @typedef { Object } HeaderPresenterAdditionalParams
 * @property { HTMLElement } eventsListRootElement
 * @property { HTMLElement } headerRootElement
 */

/**
 * @typedef { PresenterConstructorParams & HeaderPresenterAdditionalParams } HeaderPresenterConstructorParams
 */
