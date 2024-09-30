/**
 * Presenter parent abstract class
 */
export default class Presenter {
  /**
   * @type { OfferModel }
   */
  _offerModel = null;

  /**
   * @type { RouteDestinationModel }
   */
  _routeDestinationModel = null;

  /**
   * @type { RouteModel }
   */
  _routeModel = null;

  /**
   * @param { PresenterConstructorParams } constructorParams
   */
  constructor({
    destinationModel,
    offerModel,
    routeModel
  }) {
    if (new.target === Presenter) {
      throw new Error('Presenter is abstract class!');
    }

    this._offerModel = offerModel;
    this._routeDestinationModel = destinationModel;
    this._routeModel = routeModel;
  }

  /**
  * Initialize presenter
  */
  init() {
    throw new Error('Method init is abstract');
  }
}

/**
 * @typedef { import('../model/offer-model').default } OfferModel
 */

/**
 * @typedef { import('../model/route-destination-model').default } RouteDestinationModel
 */

/**
 * @typedef { import('../model/route-model').default } RouteModel
 */

/**
 * @typedef { import('../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { Object } PresenterConstructorParams
 * @property { OfferModel } PresenterConstructorParams.offerModel
 * @property { RouteDestinationModel } PresenterConstructorParams.destinationModel
 * @property { RouteModel } PresenterConstructorParams.routeModel
 */
