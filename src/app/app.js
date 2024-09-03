import RootPresenter from '../presenter/root-presenter';
import { getDataService } from '../service/data-service';

export default class Application {
  static start() {
    const dataService = getDataService();
    const applicationPresenter = new RootPresenter({ dataService });
    applicationPresenter.init();
  }
}
