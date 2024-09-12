import Presenter from '../shared/presenter';
import EventsFilterFormView from '../view/events-filter-form-view';
import EventsSortFormView from '../view/events-sort-form-view/events-sort-form-view';
import NewEventButtonView from '../view/new-event-button-view/new-event-button-view';
import AbstractView from '../framework/view/abstract-view';
import {
  EventsListItemView,
  EventsListView
} from '../view/events-list-view';
import EventInfoView from '../view/events/event-info-view';
import EditEventFormView from '../view/events/edit-event-form-view';
import DataTransferObjectService from '../service/data-transfer-object-service/data-transfer-object-service';
import {
  render,
  replace,
  RenderPosition,
  remove
} from '../framework/render';
import { DEFAULT_FILTER_TYPE, FilterTypes } from '../config/filter-types';
import { filterTypeByFunction } from '../utills/filter';
import { DEFAULT_SORTING_TYPE } from '../config/sorting-types';
import { sortingTypeByFunction } from '../utills/sorting';
import EventsMessageView from '../view/events-message-view';

/**
 * Route list presenter
 */
export default class RouteListPresenter extends Presenter {
  #activeFilterType = DEFAULT_FILTER_TYPE;
  #activeSortingType = DEFAULT_SORTING_TYPE;
  /**
   * @type { EventsSortFormView }
   */
  #sortView = null;
  #filterView = null;
  #newEventButtonView = new NewEventButtonView();

  /**
   * Root component
   * @type { EventsListView }
   */
  #listView = new EventsListView();

  /**
   * Trip events section
   * @type { HTMLElement }
   */
  #listRootElement = null;

  /**
   * Header section
   * @type { HTMLElement }
   */
  #headerRootElement = null;

  /**
   * Presenter constructor
   * @param { RouteListConstructorParams } constructorParams
   */
  constructor({ rootElement, headerRootElement, ...presenterParams }) {
    super(presenterParams);
    this.#listRootElement = rootElement;
    this.#headerRootElement = headerRootElement;
  }

  /**
   * Contain View into EventsListItemView
   * @param { AbstractView } view Contained in EventsListItemView
   * @returns { EventsListItemView }
   */
  #asEventListItem(view) {
    if (view instanceof AbstractView) {
      const listItemView = new EventsListItemView();
      render(view, listItemView.element);
      return listItemView;
    }
  }

  /**
   * Change filter
   * @param { FilterTypes } filterType
   */
  #changeFilter(filterType) {
    if (filterType && filterType !== this.#activeFilterType) {
      this.#activeFilterType = filterType;
      this.#activeSortingType = DEFAULT_SORTING_TYPE;
      this.#sortView.selectSortingInputBySortingType(DEFAULT_SORTING_TYPE);
      this.#renderEventsList();
    }
  }

  /**
   * Change sorting
   * @param { SortingTypes } sortingType
   */
  #changeSorting(sortingType) {
    if (sortingType && sortingType !== this.#activeSortingType) {
      this.#activeSortingType = sortingType;
      this.#renderEventsList();
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

    render(this.#asEventListItem(eventInfoView), this.#listView.element);
  }

  /**
   * Render points list
   * @param { RoutePointDto[] } routePoints points in route
   */
  #renderEventsList() {
    remove(this.#listView);
    render(this.#listView, this.#listRootElement);

    const filterFunction = filterTypeByFunction[this.#activeFilterType];
    const sortingFunction = sortingTypeByFunction[this.#activeSortingType];
    const filteredRoutePoints = filterFunction(new Date(), this._routeModel.data);

    if (filteredRoutePoints.length === 0) {
      this.#renderEventsMessage(`There are no ${ this.#activeFilterType } events now`);
    }

    sortingFunction(filteredRoutePoints)
      .map((current) => DataTransferObjectService.getFullRoutePointDto(
        current,
        this._offerModel.getOffersByEventType(current.type),
        this._routeDestinationModel.data
      ))
      .forEach((routePount) => this.#renderRoutePoint(routePount));
  }

  #renderFilter() {
    render(this.#filterView, this.#headerRootElement.querySelector('.trip-controls__filters'));
  }

  #renderNewEventButton() {
    render(this.#newEventButtonView, this.#headerRootElement);
  }

  #renderSorting() {
    if (this._routeModel.data.length > 0) {
      render(this.#sortView, this.#listRootElement.querySelector('h2'), RenderPosition.AFTEREND);
    }
  }

  /**
   * @param { string } message
   */
  #renderEventsMessage(message) {
    render(
      new EventsMessageView({
        message
      }),
      this.#listRootElement.querySelector('h2'),
      RenderPosition.AFTEREND
    );
  }

  init(isFailedLoadingData = false) {
    this.#filterView = new EventsFilterFormView({
      filterTypes: Object.values(FilterTypes),
      onFilterChange: (filterType) => {
        this.#changeFilter(filterType);
      },
      filtersRecordCountInfo: this._routeModel.getRoutesCountByFilters(filterTypeByFunction, new Date())
    });
    this.#sortView = new EventsSortFormView({
      onSortingChangeCallback: (newSortingType) => {
        this.#changeSorting(newSortingType);
      }
    });
    this.#renderFilter();
    this.#renderSorting();
    this.#renderNewEventButton();

    if (isFailedLoadingData) {
      this.#renderEventsMessage('Failed to load latest route information');
      return;
    }

    if (this._routeModel.data.length === 0) {
      this.#renderEventsMessage('Click New Event to create your first point');
      return;
    }
    this.#renderEventsList();
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
 * @property { HTMLElement } listRootElement
 * @property { HTMLElement } headerRootElement
 * @property { boolean } isFailedLoadingData
 */

/**
 * @typedef { PresenterConstructorParams & RouteListConstructorAdditionalParams } RouteListConstructorParams
 */

/**
 * @typedef { import('../model/route-model').RoutePointData } RoutePointData
 */

/**
 * @typedef { import('../config/sorting-types').SortingTypes } SortingTypes
 */
