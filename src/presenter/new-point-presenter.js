import NewEventButtonView from '../view/new-event-button-view/new-event-button-view';
import EditEventFormView from '../view/events/edit-event-form-view';
import { remove, render, RenderPosition, replace } from '../framework/render';
import DataTransferObjectService from '../service/data-transfer-object-service';
import { ModelActions, UserActions } from '../service/actions';
import { DEFAULT_FILTER_TYPE } from '../config/filter-types';
import { DEFAULT_SORTING_TYPE } from '../config/sorting-types';

export default class NewPointPresenter {
  /**
   * @type { RouteDestinationModel }
   */
  #destinationModel = null;

  /**
   * @type { OfferModel }
   */
  #offerModel = null;

  /**
   * @type { SortModel }
   */
  #sortModel = null;

  /**
   * @type { FilterModel }
   */
  #filterModel = null;

  /**
   * @type { HTMLElement }
   */
  #rootElement = null;

  /**
   * @type { NewEventButtonView }
   */
  #newEventButtonView = null;

  /**
   * @type { NoParamsCallback<void> }
   */
  #onNewEventCancelCallback = null;

  /**
   * @type { EditEventFormView }
   */
  #newPointView = null;

  /**
   * @type { EventsListView }
   */
  #listView = null;

  /**
   * @type { NoParamsCallback<void> }
   */
  #onNewEventButtonClickCallback = null;

  /**
   * @type { RouteModelDispatch }
   */
  #routeModelDispatch = null;

  /**
   * @param { PresenterConstructorParams } params
   */
  constructor({
    rootElement,
    onNewEventButtonClick,
    routeModelDispatch,
    onCancel,
    listView,
    destinationModel,
    offerModel,
    filterModel,
    sortModel
  }) {
    this.#rootElement = rootElement;
    this.#listView = listView;
    this.#onNewEventButtonClickCallback = onNewEventButtonClick;
    this.#routeModelDispatch = routeModelDispatch;
    this.#onNewEventCancelCallback = onCancel;
    this.#destinationModel = destinationModel;
    this.#offerModel = offerModel;
    this.#filterModel = filterModel;
    this.#sortModel = sortModel;
  }

  #newEventButtonClickHandler = () => {
    this.#filterModel.changeFilter(ModelActions.MINOR_UPDATE, DEFAULT_FILTER_TYPE);
    this.#sortModel.changeSort(ModelActions.MINOR_UPDATE, DEFAULT_SORTING_TYPE);
    this.#onNewEventButtonClickCallback();
    this.#renderNewEventButtonView(true);
    this.#renderNewEventView();
  };

  #newEventCancelButtonClickHandler = () => {
    if (this.#newPointView) {
      remove(this.#newPointView);
      this.#newPointView = null;
    }
    this.#onNewEventCancelCallback();
    this.#renderNewEventButtonView();
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
  };

  #renderNewEventButtonView() {
    const newEventButtonView = new NewEventButtonView({
      onClick: this.#newEventButtonClickHandler
    });

    if (this.#newEventButtonView) {
      replace(newEventButtonView, this.#newEventButtonView);
      remove(this.#newEventButtonView);
    } else {
      render(newEventButtonView, this.#rootElement);
    }

    this.#newEventButtonView = newEventButtonView;
  }

  #newPointSubmitHandler = (data) => {
    this.#routeModelDispatch(
      UserActions.ADD_NEW_POINT,
      ModelActions.MAJOR_UPDATE,
      data
    );
    this.#renderNewEventButtonView();
    document.removeEventListener('keydown', this.#escapeKeydownHandler);
  };

  /**
  * @param { KeyboardEvent } event
  */
  #escapeKeydownHandler = (event) => {
    if (event.key === 'Escape') {
      this.#newEventCancelButtonClickHandler();
    }
  };

  destroy() {
    this.#newEventCancelButtonClickHandler();
  }

  setDisabledAttribute(disabled) {
    if (disabled) {
      this.#newEventButtonView.element.setAttribute('disabled', true);
      return;
    }

    this.#newEventButtonView.element.removeAttribute('disabled');
  }

  #renderNewEventView() {
    const container = this.#listView.element;
    const routePointTemplate = DataTransferObjectService.getNewRoutePointDto();
    const newEventView = new EditEventFormView({
      routePoint: routePointTemplate,
      getDestinations: () => this.#destinationModel.data,
      getOffers: (eventType) => this.#offerModel.getOffersByEventType(eventType),
      onSubmit: this.#newPointSubmitHandler,
      onDelete: this.#newEventCancelButtonClickHandler
    });

    if (this.#newPointView) {
      replace(newEventView, this.#newPointView);
      remove(this.#newPointView);
      this.#newPointView = null;
    }

    render(newEventView, container, RenderPosition.AFTERBEGIN);
    this.#newPointView = newEventView;

    document.addEventListener('keydown', this.#escapeKeydownHandler);
  }

  init({ disabled = false }) {
    this.#renderNewEventButtonView();
    this.setDisabledAttribute(disabled);
  }
}

/**
 * @typedef { import('../model/offer-model').default } OfferModel
 */

/**
 * @typedef { import('../model/route-destination-model').default } RouteDestinationModel
 */

/**
 * @template TReturnType
 * @callback NoParamsCallback
 * @returns { TReturnType }
 */

/**
 * @typedef { import('../view/events-list-view').EventsListView } EventsListView
 */

/**
 * @typedef { Object } PresenterConstructorParams
 * @property { HTMLElement } PresenterConstructorParams.rootElement
 * @property { EventsListView } PresenterConstructorParams.listView
 * @property { NoParamsCallback<void> } PresenterConstructorParams.onNewEventButtonClick
 * @property { NoParamsCallback<void> } PresenterConstructorParams.onCancel
 * @property { RouteModelDispatch } PresenterConstructorParams.routeModelDispatch
 * @property { RouteDestinationModel } PresenterConstructorParams.destinationModel
 * @property { OfferModel } PresenterConstructorParams.offerModel
 * @property { FilterModel } PresenterConstructorParams.filterModel
 * @property { SortModel } PresenterConstructorParams.sortModel
 */

/**
 * @callback RouteModelDispatch
 * @param { UserActions } userAction
 * @param { ModelActions } modelActionType
 * @param { RoutePointDto } data
 * @returns { void }
 */

/**
 * @typedef { import('../model/sort-model').default } SortModel
 */

/**
 * @typedef { import('../model/fliter-model').default } FilterModel
 */
