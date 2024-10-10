import { EventsListView } from '../view/events-list-view';
import DataTransferObjectService from '../service/data-transfer-object-service/data-transfer-object-service';
import { render, remove } from '../framework/render';
import { filterTypeByFunction } from '../utills/filter';
import { sortingTypeByFunction } from '../utills/sorting';
import RoutePointItemPresenter from './route-point-item-presenter';
import { ModelActions } from '../service/actions';

/**
 * Route list presenter
 */
export default class RouteListPresenter {
  /**
   * @type { RouteModel }
   */
  #routeModel = null;

  /**
   * @type { RouteDestinationModel }
   */
  #destinationModel = null;

  /**
   * @type { OfferModel }
   */
  #offerModel = null;

  /**
   * @type { FilterModel }
   */
  #filterModel = null;

  /**
   * @type { SortModel }
   */
  #sortModel = null;

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
  #rootElement = null;

  #showMessageCallback = null;

  /**
   * @type { RouteModelDispatch }
   */
  #routeModelDispatch = null;

  /**
   * @type { SimpleCallback<void> }
   */
  #destroyMessageView = null;

  /**
   * @type { SimpleCallback<void> }
   */
  #destroySorting = null;

  /**
   * @type { SimpleCallback<void> }
   */
  #destroyNewEventForm = null;

  /**
   * @type { EventsListView }
   * @public
   */
  get listView() {
    this.#listView = this.#listView ?? new EventsListView();
    return this.#listView;
  }

  /**
   * Presenter constructor
   * @param { RouteListConstructorParams } constructorParams
   */
  constructor({
    destroyMessageView,
    showMessageCallback,
    filterModel,
    sortModel,
    rootElement,
    destinationModel,
    offerModel,
    routeModel,
    destroySorting,
    routeModelDispatch,
    destroyNewEventForm
  }) {
    this.#rootElement = rootElement;
    this.#showMessageCallback = showMessageCallback;
    this.#destroyMessageView = destroyMessageView;
    this.#destroyNewEventForm = destroyNewEventForm;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.#routeModel = routeModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#destroySorting = destroySorting;
    this.#routeModelDispatch = routeModelDispatch;
    this.#sortModel.addObserver(this.#handleValueModelsChangeActions);
    this.#filterModel.addObserver(this.#handleValueModelsChangeActions);
    this.#routeModel.addObserver(this.#handleRoutePointModelActions);
  }

  /**
   * RoutePointModel Observer
   * @param { ModelActions } actionType Updating event type
   * @param { RoutePointModelData } data Updated item
   */
  #handleRoutePointModelActions = (actionType, data) => {
    switch (actionType) {
      case ModelActions.PATCH:
      case ModelActions.MINOR_UPDATE: {
        if (!this.#routeModel.getRoutePointById(data.id)) {
          this.#pointIdToPresenterMap.get(data.id)?.destroy();
          this.#pointIdToPresenterMap.delete(data.id);
          this.#renderEventsList();
          break;
        }

        this.#pointIdToPresenterMap.get(data.id)?.init(
          DataTransferObjectService.getFullRoutePointDto(
            data,
            this.#offerModel.getOffersByEventType(data.type),
            this.#destinationModel.data
          ));
        break;
      }
      case ModelActions.MAJOR_UPDATE: {
        this.#renderEventsList();
        break;
      }
    }
  };

  #onRollupEventInfoViewClick() {
    this.#destroyNewEventForm();
    this.resetItems();
  }

  resetItems() {
    this.#pointIdToPresenterMap.forEach((itemPresenter) => {
      itemPresenter.resetView();
    });
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

  #handleValueModelsChangeActions = (actionType) => {
    switch (actionType) {
      case ModelActions.MINOR_UPDATE:
      case ModelActions.MAJOR_UPDATE: {
        this.#renderEventsList();
      }
    }
  };

  /**
   * Render points list
   * @param { RoutePointDto[] } routePoints points in route
   */
  #renderEventsList() {
    this.#destroyMessageView();
    remove(this.listView);
    this.#pointIdToPresenterMap.clear();
    const filterFunction = filterTypeByFunction[this.#filterModel.filterType];
    const sortingFunction = sortingTypeByFunction[this.#sortModel.sortType];

    if (this.#routeModel.data.length === 0) {
      this.#destroySorting();
      this.#showMessageCallback('Click New Event to create your first point');
      return;
    }

    const filteredRoutePoints = filterFunction(new Date(), this.#routeModel.data);

    if (filteredRoutePoints.length === 0) {
      this.#showMessageCallback(`There are no ${this.#filterModel.filterType} events now`);
      return;
    }

    sortingFunction(filteredRoutePoints)
      .map((current) => DataTransferObjectService.getFullRoutePointDto(
        current,
        this.#offerModel.getOffersByEventType(current.type),
        this.#destinationModel.data
      ))
      .forEach((routePoint) => {
        if (!this.#pointIdToPresenterMap.has(routePoint.id)) {
          this.#pointIdToPresenterMap.set(
            routePoint.id,
            this.#createRoutePointItemPresenter(routePoint)
          );
        }

        this.#renderRoutePoint(routePoint);
      });

    render(this.listView, this.#rootElement);
  }

  /**
   * @param { RoutePointDto } routePoint
   * @returns { RoutePointItemPresenter }
   */
  #createRoutePointItemPresenter = (routePoint) =>
    new RoutePointItemPresenter({
      destinationModel: this.#destinationModel,
      offerModel: this.#offerModel,
      rootElement: this.listView.element,
      routeModel: this.#routeModel,
      onRollupClick: () => this.#onRollupEventInfoViewClick(),
      routeModelDispatch: this.#routeModelDispatch,
      routePoint
    });

  init() {
    this.#renderEventsList();
  }
}

/**
 * @typedef { import('../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { Object } RouteListConstructorParams
 * @property { HTMLElement } RouteListConstructorParams.rootElement
 * @property { (message: string) => void } RouteListConstructorParams.showMessageCallback
 * @property { SimpleCallback<void>} RouteListConstructorParams.destroyMessageView
 * @property { SimpleCallback<void>} RouteListConstructorParams.destroySorting
 * @property { SortModel } RouteListConstructorParams.sortModel
 * @property { FilterModel } RouteListConstructorParams.filterModel
 * @property { RouteModel } RouteListConstructorParams.routeModel
 * @property { RouteDestinationModel } RouteListConstructorParams.destinationModel
 * @property { OfferModel } RouteListConstructorParams.offerModel
 * @property { SimpleCallback<void> } RouteListConstructorParams.destroyNewEventForm
 * @property { RouteModelDispatch } RouteListConstructorParams.routeModelDispatch
 */

/**
 * @typedef { import('../model/route-model').RoutePointModelData } RoutePointModelData
 */

/**
 * @typedef { import('../config/sorting-types').SortingTypes } SortingTypes
 */

/**
 * @typedef { import('../model/fliter-model').default } FilterModel
 */

/**
 * @typedef { import('../model/sort-model').default } SortModel
 */

/**
 * @typedef { import('../model/route-model').default } RouteModel
 */

/**
 * @typedef { import('../model/route-destination-model').default } RouteDestinationModel
 */

/**
 * @typedef { import('../model/offer-model').default } OfferModel
 */

/**
 * @template TReturnType
 * @callback SimpleCallback
 * @returns { TReturnType }
 */

/**
 * @callback RouteModelDispatch
 * @param { UserActions } userAction User action type
 * @param { ModelActions } modelAction Model action type
 * @param { RoutePointDto } payload Action payload
 * @returns { Promise<void> }
*/
