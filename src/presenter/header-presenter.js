import Presenter from '../shared/presenter';
import RouteInfoView from '../view/route-info-view';
import {
  remove,
  render,
  RenderPosition,
  replace
} from '../framework/render';
import DataTransferObjectService from '../service/data-transfer-object-service';
import { ModelActions } from '../service/actions';

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
    this._routeModel.addObserver(this.#handleRoutePointModelActions);
  }

  /**
   * @param { ModelActions } actionType
   */
  #handleRoutePointModelActions = (actionType) => {
    switch(actionType) {
      case ModelActions.MINOR_UPDATE:
      case ModelActions.MAJOR_UPDATE: {
        this.#renderViews();
        break;
      }
    }
  };

  #renderViews() {
    const routeTotalInfo = DataTransferObjectService.getFullRouteInfoDto(
      this._routeModel.getFullRouteInfo(),
      this._offerModel.getAllOffers(),
      this._routeDestinationModel.data
    );

    if (routeTotalInfo) {
      const newRouteInfoView = new RouteInfoView({ data: routeTotalInfo });
      if (this.#routeInfoView) {
        replace(newRouteInfoView, this.#routeInfoView);
        remove(this.#routeInfoView);
      } else {
        render(newRouteInfoView, this.#rootElement, RenderPosition.AFTERBEGIN);
      }

      this.#routeInfoView = newRouteInfoView;

      return;
    }

    if (this.#routeInfoView) {
      remove(this.#routeInfoView);
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

/**
 * @typedef { import('../service/actions').ModelActions } ModelActions
 */
