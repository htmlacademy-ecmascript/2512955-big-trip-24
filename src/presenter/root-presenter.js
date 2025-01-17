import RouteListPresenter from './route-list-presenter';
import HeaderPresenter from './header-presenter';
import EventsMessageView from '../view/events-message-view';
import { remove, render } from '../framework/render';
import SortPresenter from './sort-presenter';
import FilterPresenter from './filter-presenter';
import NewPointPresenter from './new-point-presenter';
import { UserActions } from '../service/actions';
import DataTransferObjectService from '../service/data-transfer-object-service';
import UiBlocker from '../framework/ui-blocker/ui-blocker';
import { TimeLimits } from '../config/blocker';
import { renderOrReplace } from '../utills/view';

const DEFAULT_DISPATCH_ERROR_MESSAGE = 'Can\'t apply model action';

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

  #destinationModel = null;

  #offerModel = null;

  /**
   * Presenter constructor
   * @param { PresenterConstructorParams } params
   */
  constructor({ sortModel, filterModel, routeModel, destinationModel, offerModel }) {
    this.#routeModel = routeModel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
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
      destinationModel: this.#destinationModel,
      offerModel: this.#offerModel
    });
    this.#routeListPresenter = new RouteListPresenter({
      routeModel: this.#routeModel,
      destinationModel: this.#destinationModel,
      offerModel: this.#offerModel,
      filterModel,
      sortModel,
      rootElement: tripEventsElement,
      destroyMessageView: this.#destroyMessageView,
      showMessageCallback: this.#renderMessage,
      destroySorting: () => this.#sortPresenter.destroy(),
      routeModelDispatch: this.#routeModelDispatch,
      destroyNewEventForm: () => this.#newPointPresenter.destroy()
    });
    this.#newPointPresenter = new NewPointPresenter({
      routeModelDispatch: this.#routeModelDispatch,
      routeModel: this.#routeModel,
      destinationModel: this.#destinationModel,
      offerModel: this.#offerModel,
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
   * @returns { Promise<void> }
   */
  #routeModelDispatch = async (userAction, modelAction, payload) => {
    const blocker = new UiBlocker({
      lowerLimit: TimeLimits.LOWER_LIMIT,
      upperLimit: TimeLimits.UPPER_LIMIT,
    });
    blocker.block();
    const routePoint = DataTransferObjectService.createRoutePointDataByRoutePointDto(payload);
    try {
      switch (userAction) {
        case UserActions.ADD_NEW_POINT: {
          if (routePoint['id'] || routePoint['id'] === null) {
            delete routePoint.id;
          }
          await this.#routeModel.addNewRoutePoint(modelAction, routePoint);
          break;
        }
        case UserActions.UPDATE_POINT: {
          await this.#routeModel.updateRoutePoint(modelAction, routePoint);
          break;
        }
        case UserActions.DELETE_POINT: {
          await this.#routeModel.deleteRoutePoint(modelAction, routePoint);
          break;
        }
      }
    } catch(err) {
      throw new Error(err?.message ?? DEFAULT_DISPATCH_ERROR_MESSAGE);
    } finally {
      blocker.unblock();
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

    renderOrReplace(messageView, this.#messageView, tripEventsElement);
    this.#messageView = messageView;
  };

  init() {
    this.#filterPresenter.init();
    this.#newPointPresenter.init({ disabled: true });
    this.#renderMessage('Loading...');

    Promise.all([
      this.#routeModel.init(),
      this.#offerModel.init(),
      this.#destinationModel.init()
    ]).then(() => {
      this.#destroyMessageView();
      this.#newPointPresenter.setDisabledAttribute(false);
      this.#sortPresenter.init();
      this.#headerPresenter.init();
      this.#routeListPresenter.init();
    }).catch(() => {
      this.#renderMessage('Failed to load latest route information');
    });
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
