import Presenter from '../shared/presenter';
import RouteListPresenter from './route-list-presenter';
import HeaderPresenter from './header-presenter';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

export default class RootPresenter extends Presenter {
  /**
   * Route list presenter
   * @type { RouteListPresenter }
   */
  #routeListPresenter = null;

  /**
   * @type { HeaderPresenter }
   */
  #headerPresenter = null;

  #isFailedLoadingData = false;

  /**
   * Presenter constructor
   * @param { PresenterConstructorParams } presenterConstructorParams
   */
  constructor(presenterConstructorParams) {
    super(presenterConstructorParams);
    this.#routeListPresenter = new RouteListPresenter({
      ...presenterConstructorParams,
      rootElement: tripEventsElement,
      headerRootElement: tripMainElement
    });
    this.#headerPresenter = new HeaderPresenter({
      ...presenterConstructorParams,
      headerRootElement: tripMainElement
    });
  }

  /**
   * Init sub Presenters
   */
  #initPresenters() {
    this.#routeListPresenter.init(this.#isFailedLoadingData);
    this.#headerPresenter.init();
  }

  init() {
    Promise.all([
      this._offerModel.init(),
      this._routeDestinationModel.init(),
      this._routeModel.init()
    ]).catch((reason) => {
      this.#isFailedLoadingData = !!reason;
    }).finally(() => {
      this.#initPresenters();
    });
  }
}

/**
 * @typedef { import('../shared/presenter').PresenterConstructorParams } PresenterConstructorParams
 */
