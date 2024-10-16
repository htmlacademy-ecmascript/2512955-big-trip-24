import { DEFAULT_VIEW_MODE, ViewModes } from './view-mode';
import { remove } from '../../framework/render';
import EditEventFormView from '../../view/events/edit-event-form-view';
import EventInfoView from '../../view/events/event-info-view';
import DataTransferObjectService from '../../service/data-transfer-object-service';
import AbstractView from '../../framework/view/abstract-view';
import { ModelActions, UserActions } from '../../service/actions';
import { asEventListItemView, renderOrReplace } from '../../utills/view';

export default class RoutePointItemPresenter {
  /**
   * @type { RoutePointDto }
   */
  #routePoint = null;

  /**
   * @type { OfferModel }
   */
  #offerModel = null;

  /**
   * @type { RouteDestinationModel }
   */
  #routeDestinationModel = null;

  /**
   * @type { AbstractView }
   */
  #itemView = null;

  /**
   * @type { HTMLElement }
   */
  #rootElement = null;

  /**
   * @type { ViewModes }
   */
  #viewMode = DEFAULT_VIEW_MODE;

  /**
   * @type { () => void }
   */
  #rollupButtonClickCallback = null;

  /**
   * @type { RouteModelDispatch }
   */
  #routeModelDispatch = null;

  /**
   * Presenter constructor
   * @param { RoutePountPresenterParams } presenterParams
   */
  constructor({ rootElement, routePoint, routeModelDispatch, onRollupClick, destinationModel, offerModel }) {
    this.#rootElement = rootElement;
    this.#routePoint = routePoint;
    this.#routeModelDispatch = routeModelDispatch;
    this.#rollupButtonClickCallback = onRollupClick;
    this.#offerModel = offerModel;
    this.#routeDestinationModel = destinationModel;
  }

  /**
   * View render
   * @param { AbstractView } view
   */
  #renderView(view) {
    if (view instanceof AbstractView) {
      const listItemView = asEventListItemView(view);
      renderOrReplace(listItemView, this.#itemView, this.#rootElement);
      this.#itemView = listItemView;
    }
  }

  /**
  * @param { KeyboardEvent } event
  */
  #escapeKeydownHandler = (event) => {
    if (event.key === 'Escape') {
      this.#replaceEditViewToInfoView();
    }
  };

  #replaceInfoViewToEditView() {
    if (this.#viewMode === ViewModes.VIEW) {
      this.#showViewByMode(ViewModes.EDIT);
    }
  }

  #replaceEditViewToInfoView() {
    if (this.#viewMode === ViewModes.EDIT) {
      document.removeEventListener('keydown', this.#escapeKeydownHandler);
      this.#showViewByMode(ViewModes.VIEW);
    }
  }

  /**
   * Delete route point
   * @param { RoutePointDto } routePoint
   */
  #deleteButtonClickHandler = async (routePoint) => {
    await this.#routeModelDispatch(
      UserActions.DELETE_POINT,
      ModelActions.MINOR_UPDATE,
      routePoint
    );
  };

  /**
   * Favorite change
   */
  #favoriteButtonClickHandler = async () => {
    await this.#routeModelDispatch(
      UserActions.UPDATE_POINT,
      ModelActions.PATCH,
      {
        ...this.#routePoint,
        isFavorite: !this.#routePoint.isFavorite
      }
    );
  };


  /**
   * Submit route point changes
   * @param { RoutePointDto } routePointDto
   */
  #editFormSubmitHandler = async (routePointDto) => {
    await this.#routeModelDispatch(
      UserActions.UPDATE_POINT,
      this.#getModelActionTypeByUpdateRoutePointAction(routePointDto),
      routePointDto
    );
  };

  /**
   * Optimize rerenders
   * @param { RoutePointDto } routePointDto
   */
  #getModelActionTypeByUpdateRoutePointAction(routePointDto) {
    const isDatesNotEquals = routePointDto.dateFrom !== this.#routePoint.dateFrom || routePointDto.dateTo !== this.#routePoint.dateTo;
    const isPriceNotEquals = routePointDto.basePrice !== this.#routePoint.basePrice;

    return isDatesNotEquals || isPriceNotEquals ? ModelActions.MAJOR_UPDATE : ModelActions.MINOR_UPDATE;
  }

  /**
   * Create edit view by this.#routePoint
   * @returns { EditEventFormView }
   */
  #createEditView() {
    return new EditEventFormView({
      routePoint: this.#routePoint,
      getOffers: (eventType) => this.#offerModel
        .getOffersByEventType(eventType)
        .map((current) => DataTransferObjectService.getOfferDto(current)),
      getDestinations: () => this.#routeDestinationModel.data.map((current) => DataTransferObjectService.getDestinationDto(current)),
      onRollupButtonClick: () => {
        this.#replaceEditViewToInfoView();
      },
      onSubmit: this.#editFormSubmitHandler,
      onDelete: this.#deleteButtonClickHandler
    });
  }

  /**
   * Create info view by this.#routePoint
   * @returns { EventInfoView }
   */
  #createInfoView() {
    return new EventInfoView({
      routePoint: this.#routePoint,
      onRollupButtonClick: () => {
        this.#rollupButtonClickCallback();
        this.#replaceInfoViewToEditView();
        document.addEventListener('keydown', this.#escapeKeydownHandler);
      },
      onFavoriteButtonClickCallback: this.#favoriteButtonClickHandler
    });
  }

  /**
   * Destroy presenter and view
   */
  destroy() {
    remove(this.#itemView);
    this.#itemView = null;
  }

  /**
   * Create and render view
   * @param { ViewModes } [viewMode=DEFAULT_VIEW_MODE]
   */
  #showViewByMode(viewMode = DEFAULT_VIEW_MODE) {
    this.#viewMode = viewMode;
    const view = this.#createView(viewMode);

    if (view instanceof AbstractView) {
      this.#renderView(view);
    }
  }

  /**
   * Create view
   * @param { ViewModes } [viewMode]
   * @returns { AbstractView }
   */
  #createView(viewMode = DEFAULT_VIEW_MODE) {
    switch(viewMode) {
      case ViewModes.EDIT: {
        return this.#createEditView();
      }
      case ViewModes.VIEW: {
        return this.#createInfoView();
      }
    }
  }

  resetView() {
    if (this.#viewMode !== DEFAULT_VIEW_MODE) {
      this.#showViewByMode(DEFAULT_VIEW_MODE);
    }
  }

  /**
   * Init presenter by route point parameter
   * @param { RoutePointDto } [routePoint=null]
   */
  init(routePoint = null) {
    if (routePoint) {
      this.#routePoint = routePoint;
    }
    this.#showViewByMode(DEFAULT_VIEW_MODE);
  }
}

/**
 * @typedef { import('../../service/data-transfer-object-service').RoutePointDto } RoutePointDto
 */

/**
 * @typedef { Object } RoutePountPresenterParams
 * @property { RoutePointDto } RoutePountPresenterParams.routePoint
 * @property { HTMLElement } RoutePountPresenterParams.rootElement
 * @property { () => void } RoutePountPresenterParams.onRollupClick
 * @property { RouteModelDispatch } RoutePountPresenterParams.routeModelDispatch
 * @property { OfferModel } RoutePountPresenterParams.offerModel
 * @property { RouteDestinationModel } RoutePountPresenterParams.destinationModel
 */

/**
 * @typedef { import('../../service/actions').UserActions } UserActions
 */

/**
 * @typedef { import('../../service/actions').ModelActions } ModelActions
 */

/**
 * @typedef { import('../../framework/view/abstract-view').default } AbstractView
 */

/**
 * @typedef { import('../../model/offer-model').default } OfferModel
 */

/**
 * @typedef { import('../../model/route-destination-model').default } RouteDestinationModel
 */

/**
 * @callback RouteModelDispatch
 * @param { UserActions } userAction
 * @param { ModelActions } modelActionType
 * @param { RoutePointDto } data
 * @returns { Promise<void> }
 */
