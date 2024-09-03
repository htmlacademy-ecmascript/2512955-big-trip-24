import { RouteInfoView } from '../view/route-info-view';
import { NewEventButtonView } from '../view/new-event-button-view';
import { EventsFilterFormView } from '../view/events-filter-form-view';
import { EventsSortFormView } from '../view/events-sort-form-view';
import { EventsListView } from '../view/events-list-view';
import { EventsListItemView } from '../view/events-list-view/events-list-item-view';
import { EditEventFormView } from '../view/events/edit-event-form-view';
import { RenderPosition } from '../render';
import View from '../shared/view';
import Presenter from '../shared/presenter';
import { EventInfoView } from '../view/events/event-info-view';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

export default class RootPresenter extends Presenter {
  #routeInfoView = new RouteInfoView();
  #newEventButtonView = new NewEventButtonView();
  #eventsFilterFormView = new EventsFilterFormView();
  #eventsSortFormView = new EventsSortFormView();

  constructor({ dataService }) {
    super({ dataService });
  }

  #asEventListItem(view) {
    if (view instanceof View) {
      const listItemView = new EventsListItemView();
      view.render(listItemView.getElement());
      return listItemView;
    }
  }

  #renderEventsList(routePoints) {
    const eventsListView = new EventsListView();
    eventsListView.render(tripEventsElement);
    const createEventListItemView = this.#asEventListItem(new EditEventFormView({
      routePoint: this._dataService.getNewRoutePointDto(),
      getOffers: (eventType) => this._dataService.getFullOffersDtoListByEventType(eventType),
      getDestinations: () => this._dataService.getDestinationsDto()
    }));
    const editEventListItemView = this.#asEventListItem(new EditEventFormView({
      routePoint: routePoints[0],
      getOffers: (eventType) => this._dataService.getFullOffersDtoListByEventType(eventType),
      getDestinations: () => this._dataService.getDestinationsDto()
    }));
    createEventListItemView.render(eventsListView.getElement(), RenderPosition.AFTERBEGIN);
    editEventListItemView.render(eventsListView.getElement());

    for (let pointIndex = 1; pointIndex < routePoints.length; pointIndex++) {
      const currentEventListItem = this.#asEventListItem(new EventInfoView({routePoint: routePoints[pointIndex]}));
      currentEventListItem.render(eventsListView.getElement());
    }
  }

  #renderApplication() {
    const routePoints = this._dataService.getRouteDto();
    this.#routeInfoView.render(tripMainElement, RenderPosition.AFTERBEGIN);
    this.#newEventButtonView.render(tripMainElement);
    this.#eventsFilterFormView.render(tripMainElement.querySelector('.trip-controls__filters'));
    this.#eventsSortFormView.render(tripEventsElement);

    if (routePoints.length > 0) {
      this.#renderEventsList(routePoints);
    }
  }

  init() {
    this._dataService.init()
      .then(() => {
        this.#renderApplication();
      });
  }
}
