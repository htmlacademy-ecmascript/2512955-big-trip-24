import DataTransferObjectService from '../service/data-transfer-object-service/data-transfer-object-service';

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
   * Get route points info
   * @returns { RoutePointDto[] }
   */
  _getRoutePointsDto() {
    return this._routeModel.data.map((current) => {
      const offersByRoutePointType = this._offerModel.getOffersByEventType(current.type);
      return DataTransferObjectService.getFullRoutePointDto(current, offersByRoutePointType, this._routeDestinationModel.data);
    });
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
