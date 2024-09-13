import Presenter from '../shared/presenter';
import RouteListPresenter from './route-list-presenter';
import HeaderPresenter from './header-presenter';
import EventsMessageView from '../view/events-message-view';
import { remove, render, RenderPosition, replace } from '../framework/render';

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
   * @type { EventsMessageView }
   */
  #messageView = null;

  /**
   * Presenter constructor
   * @param { PresenterConstructorParams } presenterConstructorParams
   */
  constructor(presenterConstructorParams) {
    super(presenterConstructorParams);
    this.#routeListPresenter = new RouteListPresenter({
      ...presenterConstructorParams,
      rootElement: tripEventsElement,
      headerRootElement: tripMainElement,
      showMessage: this.#renderMessage,
      destroyMessageView: this.#destroyMessageView
    });
    this.#headerPresenter = new HeaderPresenter({
      ...presenterConstructorParams,
      headerRootElement: tripMainElement
    });
  }

  #destroyMessageView = () => {
    if (this.#messageView) {
      remove(this.#messageView);
      this.#messageView = null;
    }
  };

  #renderMessage = (message) => {
    const messageView = new EventsMessageView({ message });

    if (this.#messageView) {
      replace(messageView, this.#messageView);
    } else {
      render(messageView, tripEventsElement, RenderPosition.BEFOREEND);
    }

    this.#messageView = messageView;
  };

  /**
   * Init sub Presenters
   */
  #initPresenters() {
    if (this.#messageView) {
      remove(this.#messageView);
      this.#messageView = null;
    }

    this.#routeListPresenter.init(this.#isFailedLoadingData);
    this.#headerPresenter.init();
  }

  init() {
    Promise.all([
      this._offerModel.init(),
      this._routeDestinationModel.init(),
      this._routeModel.init()
    ]).catch((reason) => {
      this.#renderMessage(reason);
    }).finally(() => {
      this.#initPresenters();
    });
  }
}

/**
 * @typedef { import('../shared/presenter').PresenterConstructorParams } PresenterConstructorParams
 */

/**
 * @typedef { PresenterConstructorParams & { showMessage: (message: string) => void } }
 */
