import RootPresenter from '../presenter/root-presenter';
import RouteModel from '../model/route-model';
import OfferModel from '../model/offer-model';
import RouteDestinationModel from '../model/route-destination-model';
import FilterModel from '../model/fliter-model';
import SortModel from '../model/sort-model';

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

    const routeModel = new RouteModel();
    const offerModel = new OfferModel();
    const destinationModel = new RouteDestinationModel();
    const filterModel = new FilterModel();
    const sortModel = new SortModel();
    const rootPresenter = new RootPresenter({
      routeModel,
      offerModel,
      destinationModel,
      filterModel,
      sortModel
    });

    Promise.all([
      routeModel.init(),
      offerModel.init(),
      destinationModel.init()
    ]).then(() => {
      rootPresenter.init({ isDataLoadingFailed: false });
    }).catch(() => {
      rootPresenter.init({ isDataLoadingFailed: true });
    });
  }
}
