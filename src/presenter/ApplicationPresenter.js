import { RouteInfoView } from '../view/route-info-view';
import { NewEventButtonView } from '../view/new-event-button-view';
import { EventsFilterFormView } from '../view/events-filter-form-view';
import { EventsSortFormView } from '../view/events-sort-form-view';
import { CreateEventFormView } from '../view/events/create-event-form-view';
import { EventsListView } from '../view/events-list-view';
import { EventsListItemView } from '../view/events-list-view/events-list-item-view';
import { EditEventFormView } from '../view/events/edit-event-form-view';
import { RenderPosition } from '../render';
import View from '../shared/view';
import { EventInfoView } from '../view/events/event-info-view';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

export default class ApplicationPresenter {
  #asEventListItem(view) {
    if (view instanceof View) {
      const listItemView = new EventsListItemView();
      view.render(listItemView.getElement());
      return listItemView;
    }
  }

  #renderEventsList() {
    const eventsListView = new EventsListView();
    eventsListView.render(tripEventsElement);
    const createEventListItemView = this.#asEventListItem(new CreateEventFormView());
    const editEventListItemView = this.#asEventListItem(new EditEventFormView());
    createEventListItemView.render(eventsListView.getElement(), RenderPosition.AFTERBEGIN);
    editEventListItemView.render(eventsListView.getElement());
    Array.from(
      { length: 3 },
      () => this.#asEventListItem(new EventInfoView())
    ).forEach((current) => {
      current.render(eventsListView.getElement());
    });
  }

  init() {
    const routeInfoView = new RouteInfoView();
    const newEventButtonView = new NewEventButtonView();
    const eventsFilterFormView = new EventsFilterFormView();
    const eventsSortFormView = new EventsSortFormView();
    routeInfoView.render(tripMainElement, RenderPosition.AFTERBEGIN);
    newEventButtonView.render(tripMainElement);
    eventsFilterFormView.render(tripMainElement.querySelector('.trip-controls__filters'));
    eventsSortFormView.render(tripEventsElement);
    this.#renderEventsList();
  }
}
