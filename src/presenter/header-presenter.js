import RouteInfoView from '../view/route-info-view';
import {
  remove,
  render,
  RenderPosition,
  replace
} from '../framework/render';
import DataTransferObjectService from '../service/data-transfer-object-service';
import { ModelActions } from '../service/actions';

export default class HeaderPresenter {
  /**
   * @type { OfferModel }
   */
  #offerModel = null;

  /**
   * @type { RouteDestinationModel }
   */
  #destinationModel = null;

  /**
   * @type { RouteModel }
   */
  #routeModel = null;

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
   * @param { HeaderPresenterParams } presenterParams
   */
  constructor({ headerRootElement, routeModel, destinationModel, offerModel }) {
    this.#rootElement = headerRootElement;
    this.#routeModel = routeModel;
    this.#offerModel = offerModel;
    this.#destinationModel = destinationModel;
    this.#routeModel.addObserver(this.#handleRoutePointModelActions);
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
      this.#routeModel.getFullRouteInfo(),
      this.#offerModel.getAllOffers(),
      this.#destinationModel.data
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
      this.#routeInfoView = null;
    }
  }

  init() {
    this.#renderViews();
  }
}

/**
 * @typedef { import('../model/route-model').default } RouteModel
 */

/**
 * @typedef { import('../model/offer-model').default } OfferModel
 */

/**
 * @typedef { import('../model/route-destination-model').default } RouteDestinationModel
 */


/**
 * @typedef { Object } HeaderPresenterParams
 * @property { HTMLElement } HeaderPresenterParams.headerRootElement
 * @property { RouteModel } HeaderPresenterParams.routeModel
 * @property { OfferModel } HeaderPresenterParams.offerModel
 * @property { RouteDestinationModel } HeaderPresenterParams.destinationModel
 */

/**
 * @typedef { import('../service/actions').ModelActions } ModelActions
 */
