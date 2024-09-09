import Presenter from '../shared/presenter';
import EventsFilterFormView from '../view/events-filter-form-view';
import EventsSortFormView from '../view/events-sort-form-view/events-sort-form-view';
import NewEventButtonView from '../view/new-event-button-view/new-event-button-view';
import RouteInfoView from '../view/route-info-view/route-info-view';
import { RenderPosition } from '../framework/render';

const tripHeaderElement = document.querySelector('.trip-main');

export default class HeaderPresenter extends Presenter {
  #sortView = new EventsSortFormView();
  #filterView = new EventsFilterFormView();
  #newEventButtonView = new NewEventButtonView();
  #routeInfoView = new RouteInfoView();

  /**
   * List root element
   * @type { HTMLElement }
   */
  #eventsListRootElement = null;

  /**
   * Header root element
   * @type { HTMLElement }
   */
  #headerRootElement = null;

  /**
   * Header presenter constructor
   * @param { HeaderPresenterConstructorParams } presenterParams
   */
  constructor({ eventsListRootElement, headerRootElement, ...presenterParams }) {
    super(presenterParams);
    this.#eventsListRootElement = eventsListRootElement;
    this.#headerRootElement = headerRootElement;
  }

  init() {
    this.#routeInfoView.render(tripHeaderElement, RenderPosition.AFTERBEGIN);
    this.#newEventButtonView.render(tripHeaderElement);
    this.#filterView.render(tripHeaderElement.querySelector('.trip-controls__filters'));
    this.#sortView.render(this.#eventsListRootElement.querySelector('h2'), RenderPosition.AFTEREND);
  }
}

/**
 * @typedef { import('../shared/presenter').PresenterConstructorParams } PresenterConstructorParams
 */

/**
 * @typedef { Object } HeaderPresenterAdditionalParams
 * @property { HTMLElement } eventsListRootElement
 * @property { HTMLElement } headerRootElement
 */

/**
 * @typedef { PresenterConstructorParams & HeaderPresenterAdditionalParams } HeaderPresenterConstructorParams
 */
