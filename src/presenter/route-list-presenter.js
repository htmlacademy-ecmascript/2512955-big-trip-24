import Presenter from '../shared/presenter';
import View from '../shared/view';
import {
  EventsListItemView,
  EventsListView
} from '../view/events-list-view';
import EventInfoView from '../view/events/event-info-view';
import EditEventFormView from '../view/events/edit-event-form-view';
import DataTransferObjectService from '../service/data-transfer-object-service/data-transfer-object-service';
import { replace } from '../framework/render';

/**
 * Route list presenter
 */
export default class RouteListPresenter extends Presenter {
  /**
   * Root component
   * @type { EventsListView }
   */
  #listView = new EventsListView();

  /**
   * Trip events section
   * @type { HTMLElement }
   */
  #rootElement = null;

  /**
   * Presenter constructor
   * @param { RouteListConstructorParams } constructorParams
   */
  constructor({ rootElement, ...presenterParams }) {
    super(presenterParams);
    this.#rootElement = rootElement;
  }

  /**
   * Contain View into EventsListItemView
   * @param { View<null> } view Contained in EventsListItemView
   * @returns { EventsListItemView }
   */
  #asEventListItem(view) {
    if (view instanceof View) {
      const listItemView = new EventsListItemView();
      view.render(listItemView.element);
      return listItemView;
    }
  }

  /**
   * Render one route point
   * @param { RoutePointDto } routePoint
   */
  #renderRoutePoint(routePoint) {
    /**
     * @param { KeyboardEvent } event
     */
    const onEscapeKeydown = (event) => {
      if (event.key === 'Escape') {
        replaceEditViewToInfoView();
      }
    };

    const eventInfoView = new EventInfoView({
      routePoint: routePoint,
      onRollupButtonClick: () => {
        replaceInfoViewToEditView();
        document.addEventListener('keydown', onEscapeKeydown);
      }
    });

    const eventEditView = new EditEventFormView({
      routePoint,
      getOffers: (eventType) => this._offerModel
        .getOffersByEventType(eventType)
        .map((current) => DataTransferObjectService.getOfferDto(current)),
      getDestinations: () => this._routeDestinationModel.data.map((current) => DataTransferObjectService.getDestinationDto(current)),
      onRollupButtonClick: () => replaceEditViewToInfoView(),
      onSaveButtonClick: () => replaceEditViewToInfoView()
    });

    function replaceInfoViewToEditView() {
      replace(eventEditView, eventInfoView);
    }

    function replaceEditViewToInfoView() {
      document.removeEventListener('keydown', onEscapeKeydown);
      replace(eventInfoView, eventEditView);
    }

    this.#asEventListItem(eventInfoView)
      .render(this.#listView.element);
  }

  /**
   * Render points list
   * @param { RoutePointDto[] } routePoints points in route
   */
  #renderEventsList(routePoints) {
    this.#listView.render(this.#rootElement);
    routePoints.forEach((routePount) => this.#renderRoutePoint(routePount));
  }

  init() {
    const routePoints = this._getRoutePointsDto();
    this.#renderEventsList(routePoints);
  }
}

/**
 * @typedef { import('../shared/presenter').PresenterConstructorParams } PresenterConstructorParams
 */

/**
 * @typedef { import('../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { Object } RouteListConstructorAdditionalParams
 * @property { HTMLElement } rootElement
 */

/**
 * @typedef { PresenterConstructorParams & RouteListConstructorAdditionalParams } RouteListConstructorParams
 */
