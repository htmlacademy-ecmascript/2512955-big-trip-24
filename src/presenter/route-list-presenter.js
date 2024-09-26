import Presenter from '../shared/presenter';
import NewEventButtonView from '../view/new-event-button-view/new-event-button-view';
import { EventsListView } from '../view/events-list-view';
import DataTransferObjectService from '../service/data-transfer-object-service/data-transfer-object-service';
import { render, remove } from '../framework/render';
import { filterTypeByFunction } from '../utills/filter';
import { sortingTypeByFunction } from '../utills/sorting';
import RoutePointItemPresenter from './route-point-item-presenter';
import { ModelActions, UserActions } from '../service/actions';
import FilterPresenter from './filter-presenter';
import SortPresenter from './sort-presenter';
/**
 * Route list presenter
 */
export default class RouteListPresenter extends Presenter {
  /**
   * @type { EventsSortFormView }
   */
  #newEventButtonView = new NewEventButtonView();

  /**
   * @type { FilterPresenter }
   */
  #filterPresenter = null;

  /**
   * @type { FilterModel }
   */
  #filterModel = null;

  /**
   * @type { SortPresenter }
   */
  #sortPresenter = null;

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
  constructor({ destroyMessageView, showMessageCallback, filterModel, sortModel, rootElement, headerRootElement, ...presenterParams }) {
    super(presenterParams);
    this.#listRootElement = rootElement;
    this.#headerRootElement = headerRootElement;
    this.#showMessageCallback = showMessageCallback;
    this.#destroyMessageView = destroyMessageView;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
    this.#filterPresenter = new FilterPresenter({
      rootElement: this.#headerRootElement.querySelector('.trip-controls__filters'),
      routeModel: this._routeModel,
      offerModel: this._offerModel,
      destinationModel: this._routeDestinationModel,
      filterModel: this.#filterModel,
      sortModel: this.#sortModel
    });
    this.#sortPresenter = new SortPresenter({
      previousElement: this.#listRootElement.querySelector('h2'),
      routeModel: this._routeModel,
      offerModel: this._offerModel,
      destinationModel: this._routeDestinationModel,
      sortModel: this.#sortModel,
    });
    this.#sortModel.addObserver(this.#handleValueModelsChangeActions);
    this.#filterModel.addObserver(this.#handleValueModelsChangeActions);
    this._routeModel.addObserver(this.#handleRoutePointModelActions);
  }

  /**
   * Route point reducer
   * @param { UserActions } userActionType
   * @param { ModelActions } updateActionType
   * @param { RoutePointDto } data
   */
  #handleRoutePointUserActions = (userActionType, updateActionType, data) => {
    let routeModelAction = null;
    switch (userActionType) {
      case UserActions.ADD_NEW_POINT: {
        routeModelAction = this._routeModel.addNewRoutePoint;
        break;
      }
      case UserActions.UPDATE_POINT: {
        routeModelAction = this._routeModel.updateRoutePoint;
        break;
      }
      case UserActions.DELETE_POINT: {
        routeModelAction = this._routeModel.deleteRoutePoint;
        break;
      }
    }

    if (routeModelAction) {
      routeModelAction.call(
        this._routeModel,
        updateActionType,
        DataTransferObjectService.createRoutePointDataByRoutePointDto(data)
      );
    }
  };

  /**
   * RoutePointModel Observer
   * @param { ModelActions } actionType Updating event type
   * @param { RoutePointData } data Updated item
   */
  #handleRoutePointModelActions = (actionType, data) => {
    switch (actionType) {
      case ModelActions.PATCH:
      case ModelActions.MINOR_UPDATE: {
        if (!this._routeModel.getRoutePointById(data.id)) {
          this.#pointIdToPresenterMap.get(data.id)?.destroy();
          this.#pointIdToPresenterMap.delete(data.id);
          this.#renderEventsList();
          break;
        }

        this.#pointIdToPresenterMap.get(data.id)?.init(
          DataTransferObjectService.getFullRoutePointDto(
            data,
            this._offerModel.getOffersByEventType(data.type),
            this._routeDestinationModel.data
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
    remove(this.#listView);
    this.#pointIdToPresenterMap.clear();
    const filterFunction = filterTypeByFunction[this.#filterModel.filterType];
    const sortingFunction = sortingTypeByFunction[this.#sortModel.sortType];

    if (this._routeModel.data.length === 0) {
      this.#sortPresenter.destroy();
      this.#showMessageCallback('Click New Event to create your first point');
      return;
    }

    const filteredRoutePoints = filterFunction(new Date(), this._routeModel.data);

    if (filteredRoutePoints.length === 0) {
      this.#showMessageCallback(`There are no ${this.#filterModel.filterType} events now`);
      return;
    }

    render(this.#listView, this.#listRootElement);

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
            this.#createRoutePointItemPresenter(routePoint)
          );
        }

        this.#renderRoutePoint(routePoint);
      });
  }

  /**
   * @param { RoutePointDto } routePoint
   * @returns { RoutePointItemPresenter }
   */
  #createRoutePointItemPresenter = (routePoint) =>
    new RoutePointItemPresenter({
      destinationModel: this._routeDestinationModel,
      offerModel: this._offerModel,
      rootElement: this.#listView.element,
      routeModel: this._routeModel,
      onRollupClick: () => this.#onRollupEventInfoViewClick(),
      routeModelDispatch: this.#handleRoutePointUserActions,
      routePoint
    });

  #renderNewEventButton() {
    render(this.#newEventButtonView, this.#headerRootElement);
  }

  init() {
    this.#filterPresenter.init();
    this.#renderNewEventButton();

    this.#sortPresenter.init();
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
 * @property { SortModel } RouteListConstructorAdditionalParams.sortModel
 * @property { FilterModel } RouteListConstructorAdditionalParams.filterModel
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

/**
 * @typedef { import('../model/fliter-model').default } FilterModel
 */

/**
 * @typedef { import('../model/sort-model').default } SortModel
 */
