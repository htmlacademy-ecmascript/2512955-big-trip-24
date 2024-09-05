import RouteModel from '../../model/route-model';
import OfferModel from '../../model/offer-model';
import RouteDestinationModel from '../../model/route-destination-model';
import { NEW_ROUTE_POINT_DTO } from './defaults';

/**
 * DataService class
 * @class DataService
 */
export default class DataService {
  #offerModel = new OfferModel();
  #destinationModel = new RouteDestinationModel();
  #routeModel = new RouteModel();

  /**
   * @method
   */
  async init() {
    try {
      await Promise.all([
        this.#offerModel.init(),
        this.#destinationModel.init(),
        this.#routeModel.init()
      ]);
    } catch(err) {
      throw new Error(String(err));
    }
  }

  /**
   * @method
   */
  getFullOffersDtoListByEventType(eventType) {
    return this.#offerModel.getOffersByEventType(eventType);
  }

  /**
   * @method
   */
  getDestinationsDto() {
    return this.#destinationModel.data;
  }

  /**
   * @method
   */
  getDestinationDtoById(destinationId) {
    return this.#destinationModel.getDestinationById(destinationId);
  }

  /**
   * @method
   */
  getNewRoutePointDto() {
    return structuredClone(NEW_ROUTE_POINT_DTO);
  }

  /**
   * @method
   */
  getRouteDto() {
    const routePoints = this.#routeModel.data;
    return routePoints.map((current) => {
      const offers = this.getFullOffersDtoListByEventType(current.type);
      const destinationObject = this.getDestinationDtoById(current?.destination);
      const offersObjects = current?.offers?.length
        ? current.offers.map((offerId) => offers.find((offer) => offer.id === offerId)).filter(Boolean)
        : [];

      return {
        ...current,
        offers: offersObjects,
        destination: destinationObject
      };
    });
  }
}
