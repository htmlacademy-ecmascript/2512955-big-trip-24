import Presenter from '../shared/presenter';
import EventsFilterFormView from '../view/events-filter-form-view';
import EventsSortFormView from '../view/events-sort-form-view/events-sort-form-view';
import NewEventButtonView from '../view/new-event-button-view/new-event-button-view';
import { EventsListView } from '../view/events-list-view';
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
import RoutePointItemPresenter from './route-point-item-presenter';
import { EventTypes } from '../model/route-model';

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
   * @type { Map<string, RoutePointItemPresenter> }
   */
  #pointIdToPresenterMap = new Map();

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

  #showMessageCallback = null;
  #destroyMessageView = null;

  /**
   * Presenter constructor
   * @param { RouteListConstructorParams } constructorParams
   */
  constructor({ destroyMessageView, showMessageCallback, rootElement, headerRootElement, ...presenterParams }) {
    super(presenterParams);
    this.#listRootElement = rootElement;
    this.#headerRootElement = headerRootElement;
    this.#showMessageCallback = showMessageCallback;
    this.#destroyMessageView = destroyMessageView;
  }

  #updateRoutePointByDto(routePointDto) {
    const routePointData = DataTransferObjectService.createRoutePointDataByRoutePointDto(routePointDto);
    this._routeModel.updateRoutePoint(routePointData);
    const updatedRoutePointData = this._routeModel.getRoutePointById(routePointDto.id);
    return DataTransferObjectService.getFullRoutePointDto(
      updatedRoutePointData,
      this._offerModel.getOffersByEventType(updatedRoutePointData.type),
      this._routeDestinationModel.data
    );
  }

  /**
   * Data change handler
   * @param { EventTypes } eventType Updating event type
   * @param { RoutePointDto } data Updated item
   */
  #routePointsEventHandler = (eventType, data) => {
    switch (eventType) {
      case EventTypes.MINOR_ITEM_UPDATE: {
        const updatedItem = this.#updateRoutePointByDto(data);
        if (updatedItem) {
          this.#pointIdToPresenterMap.get(updatedItem.id)?.init(updatedItem);
        }
        break;
      }
      case EventTypes.MAJOR_ITEM_UPDATE: {
        this.#updateRoutePointByDto(data);
        this.#renderEventsList();
        break;
      }
    }
  };

  #onRollupEventInfoViewClick() {
    this.#pointIdToPresenterMap.forEach((itemPresenter) => {
      itemPresenter.resetView();
    });
  }

  /**
   * Change filter
   * @param { FilterTypes } filterType
   */
  #changeFilter(filterType) {
    if (filterType && filterType !== this.#activeFilterType) {
      this.#activeFilterType = filterType;
      this.#activeSortingType = DEFAULT_SORTING_TYPE;
      this.#destroyMessageView();
      this.#renderSorting();
      this.#renderFilter();
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
      this.#renderSorting();
      this.#renderEventsList();
    }
  }

  /**
   * Render one route point
   * @param { RoutePointDto } routePoint
   */
  #renderRoutePoint(routePoint) {
    const routePointId = routePoint.id;

    if (routePointId) {
      this.#pointIdToPresenterMap.get(routePointId)?.init(routePoint);
    }
  }

  /**
   * Render points list
   * @param { RoutePointDto[] } routePoints points in route
   */
  #renderEventsList() {
    remove(this.#listView);
    render(this.#listView, this.#listRootElement);
    this.#pointIdToPresenterMap.clear();

    const filterFunction = filterTypeByFunction[this.#activeFilterType];
    const sortingFunction = sortingTypeByFunction[this.#activeSortingType];
    const filteredRoutePoints = filterFunction(new Date(), this._routeModel.data);

    if (filteredRoutePoints.length === 0) {
      this.#showMessageCallback(`There are no ${this.#activeFilterType} events now`);
    }

    sortingFunction(filteredRoutePoints)
      .map((current) => DataTransferObjectService.getFullRoutePointDto(
        current,
        this._offerModel.getOffersByEventType(current.type),
        this._routeDestinationModel.data
      ))
      .forEach((routePoint) => {
        if (!this.#pointIdToPresenterMap.has(routePoint.id)) {
          this.#pointIdToPresenterMap.set(
            routePoint.id,
            new RoutePointItemPresenter({
              destinationModel: this._routeDestinationModel,
              offerModel: this._offerModel,
              rootElement: this.#listView.element,
              routeModel: this._routeModel,
              onRollupClick: () => this.#onRollupEventInfoViewClick(),
              onDataChange: this.#routePointsEventHandler,
              routePoint
            })
          );
        }

        this.#renderRoutePoint(routePoint);
      });
  }

  #renderFilter() {
    const filterView = new EventsFilterFormView({
      filterTypes: Object.values(FilterTypes),
      onFilterChange: (filterType) => {
        this.#changeFilter(filterType);
      },
      filtersRecordCountInfo: this._routeModel.getRoutesCountByFilters(filterTypeByFunction, new Date()),
      activeFilterType: this.#activeFilterType
    });

    if (this.#filterView) {
      replace(filterView, this.#filterView);
      remove(this.#filterView);
    } else {
      render(filterView, this.#headerRootElement.querySelector('.trip-controls__filters'));
    }

    this.#filterView = filterView;
  }

  #renderNewEventButton() {
    render(this.#newEventButtonView, this.#headerRootElement);
  }

  #renderSorting() {
    const newSortingView = new EventsSortFormView({
      onSortingChangeCallback: (newSortingType) => {
        this.#changeSorting(newSortingType);
      },
      activeSortType: this.#activeSortingType
    });

    if (this.#sortView) {
      replace(newSortingView, this.#sortView);
      remove(this.#sortView);
    } else {
      render(newSortingView, this.#listRootElement.querySelector('h2'), RenderPosition.AFTEREND);
    }

    this.#sortView = newSortingView;
  }

  init() {
    this.#renderFilter();
    this.#renderNewEventButton();

    if (this._routeModel.data.length === 0) {
      this.#showMessageCallback('Click New Event to create your first point');
      return;
    }

    this.#renderSorting();
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
 * @property { HTMLElement } RouteListConstructorAdditionalParams.listRootElement
 * @property { HTMLElement } RouteListConstructorAdditionalParams.headerRootElement
 * @property { boolean } RouteListConstructorAdditionalParams.isFailedLoadingData
 * @property { (message: string) => void } RouteListConstructorAdditionalParams.showMessageCallback
 * @property { () => void } RouteListConstructorAdditionalParams.destroyMessageView
 */

/**
 * @typedef { PresenterConstructorParams & RouteListConstructorAdditionalParams } RouteListConstructorParams
 */

/**
 * @typedef { import('../model/route-model/route-model').RoutePointData } RoutePointData
 */

/**
 * @typedef { import('../config/sorting-types').SortingTypes } SortingTypes
 */
