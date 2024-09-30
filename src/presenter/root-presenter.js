import RouteListPresenter from './route-list-presenter';
import HeaderPresenter from './header-presenter';
import EventsMessageView from '../view/events-message-view';
import { remove, render, RenderPosition, replace } from '../framework/render';
import SortPresenter from './sort-presenter';
import FilterPresenter from './filter-presenter';
import NewPointPresenter from './new-point-presenter';
import { UserActions } from '../service/actions';
import DataTransferObjectService from '../service/data-transfer-object-service';

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

export default class RootPresenter {
  /**
   * Route list presenter
   * @type { RouteListPresenter }
   */
  #routeListPresenter = null;

  /**
   * @type { NewPointPresenter }
   */
  #newPointPresenter = null;

  /**
   *@type { SortPresenter }
   */
  #sortPresenter = null;

  /**
   * @type { FilterPresenter }
   */
  #filterPresenter = null;

  /**
   * @type { HeaderPresenter }
   */
  #headerPresenter = null;

  /**
   * @type { EventsMessageView }
   */
  #messageView = null;

  /**
   * @type { RouteModel }
   */
  #routeModel = null;

  /**
   * Presenter constructor
   * @param { PresenterConstructorParams } params
   */
  constructor({ sortModel, filterModel, routeModel, destinationModel, offerModel }) {
    this.#routeModel = routeModel;
    this.#sortPresenter = new SortPresenter({
      sortModel,
      previousElement: tripEventsElement.querySelector('h2')
    });
    this.#filterPresenter = new FilterPresenter({
      filterModel,
      sortModel,
      routeModel: this.#routeModel,
      rootElement: tripMainElement.querySelector('.trip-controls__filters')
    });
    this.#headerPresenter = new HeaderPresenter({
      headerRootElement: tripMainElement,
      routeModel: this.#routeModel,
      destinationModel,
      offerModel
    });
    this.#routeListPresenter = new RouteListPresenter({
      routeModel: this.#routeModel,
      destinationModel,
      filterModel,
      sortModel,
      offerModel,
      rootElement: tripEventsElement,
      destroyMessageView: this.#destroyMessageView,
      showMessageCallback: this.#renderMessage,
      destroySorting: () => this.#sortPresenter.destroy(),
      routeModelDispatch: this.#routeModelDispatch,
      destroyNewEventForm: () => this.#newPointPresenter.destroy()
    });
    this.#newPointPresenter = new NewPointPresenter({
      routeModelDispatch: this.#routeModelDispatch,
      destinationModel,
      offerModel,
      routeModel: this.#routeModel,
      listView: this.#routeListPresenter.listView,
      rootElement: tripMainElement,
      onNewEventButtonClick: this.#newEventButtonClickHandler,
      onCancel: this.#newEventFormCloseButtonClickHandler,
      filterModel,
      sortModel
    });
  }

  #newEventButtonClickHandler = () => {
    this.#routeListPresenter.resetItems();
    if (!tripEventsElement.contains(this.#routeListPresenter.listView.element)) {
      this.#destroyMessageView();
      render(this.#routeListPresenter.listView, tripEventsElement);
    }
  };

  #newEventFormCloseButtonClickHandler = () => {
    if (this.#routeListPresenter.listView.element.children.length === 0) {
      this.#routeListPresenter.init();
    }
  };

  /**
   * Route model dispatch
   * @param { UserActions } userAction User action type
   * @param { ModelActions } modelAction Model action type
   * @param { RoutePointDto } payload Action payload
   * @returns { void }
   */
  #routeModelDispatch = (userAction, modelAction, payload) => {
    let routeModelAction = null;
    switch (userAction) {
      case UserActions.ADD_NEW_POINT: {
        routeModelAction = this.#routeModel.addNewRoutePoint;
        break;
      }
      case UserActions.UPDATE_POINT: {
        routeModelAction = this.#routeModel.updateRoutePoint;
        break;
      }
      case UserActions.DELETE_POINT: {
        routeModelAction = this.#routeModel.deleteRoutePoint;
        break;
      }
    }

    if (routeModelAction) {
      routeModelAction.call(
        this.#routeModel,
        modelAction,
        DataTransferObjectService.createRoutePointDataByRoutePointDto(payload)
      );
    }
  };

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

  init({ isDataLoadingFailed = false }) {
    this.#filterPresenter.init();
    this.#newPointPresenter.init({ disabled: isDataLoadingFailed });
    if (isDataLoadingFailed) {
      this.#renderMessage('Failed to load latest route information');
      return;
    }
    this.#sortPresenter.init();
    this.#headerPresenter.init();
    this.#routeListPresenter.init();
  }
}

/**
 * @typedef { import('../shared/presenter').PresenterConstructorParams } BasePresenterConstructorParams
 */

/**
 * @typedef { import('../model/fliter-model').default } FilterModel
 */

/**
 * @typedef { import('../model/sort-model').default } SortModel
 */

/**
 * @typedef { import('../model/offer-model').default } OfferModel
 */

/**
 * @typedef { import('../model/route-destination-model').default } RouteDestinationModel
 */

/**
 * @typedef { import('../model/route-model').default } RouteModel
 */

/**
 * @typedef { import('../model/offer-model').default } OfferModel
 */

/**
 * @typedef { import('../service/actions').ModelActions } ModelActions
 */

/**
 * @typedef { import('../service/actions').UserActions } UserActions
 */

/**
 * @typedef { import('../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { Object } PresenterConstructorParams
 * @property { FilterModel } PresenterConstructorAdditionalParams.filterModel
 * @property { SortModel } PresenterConstructorAdditionalParams.sortModel
 * @property { RouteModel } PresenterConstructorAdditionalParams.routeModel
 * @property { OfferModel } PresenterConstructorAdditionalParams.offerModel
 * @property { RouteDestinationModel } PresenterAdditionalParams.destinationModel
 */
