import RootPresenter from '../presenter/root-presenter';
import RouteModel from '../model/route-model';
import OfferModel from '../model/offer-model';
import RouteDestinationModel from '../model/route-destination-model';
import FilterModel from '../model/fliter-model';
import SortModel from '../model/sort-model';
import { SERVER_URL, AUTHORIZATION_TOKEN } from '../config/api';
import RouteApiService from '../service/route-api-service';

import 'flatpickr/dist/flatpickr.min.css';

/**
 * Application startup class
 * @static
 */
export default class Application {
  /**
   * Start application
   * @static
   */
  static start() {
    const api = new RouteApiService({ endpoint: SERVER_URL, authorizationToken: AUTHORIZATION_TOKEN });
    const routeModel = new RouteModel({ api });
    const offerModel = new OfferModel({ api });
    const destinationModel = new RouteDestinationModel({ api });
    const filterModel = new FilterModel();
    const sortModel = new SortModel();
    const rootPresenter = new RootPresenter({
      routeModel,
      offerModel,
      destinationModel,
      filterModel,
      sortModel
    });

    rootPresenter.init();
  }
}
