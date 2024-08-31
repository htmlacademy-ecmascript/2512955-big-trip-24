import ApplicationPresenter from '../presenter/ApplicationPresenter';

export default class Application {
  static start() {
    const applicationPresenter = new ApplicationPresenter();
    applicationPresenter.init();
  }
}
