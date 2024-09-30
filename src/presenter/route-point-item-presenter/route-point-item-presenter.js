import Presenter from '../../shared/presenter';
import { DEFAULT_VIEW_MODE, ViewModes } from './view-mode';
import { remove, render, replace } from '../../framework/render';
import EditEventFormView from '../../view/events/edit-event-form-view';
import EventInfoView from '../../view/events/event-info-view';
import DataTransferObjectService from '../../service/data-transfer-object-service';
import AbstractView from '../../framework/view/abstract-view';
import { EventsListItemView } from '../../view/events-list-view';
import { ModelActions, UserActions } from '../../service/actions';

export default class RoutePointItemPresenter extends Presenter {
  /**
   * @type { RoutePointDto }
   */
  #routePoint = null;

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
  #rollupButtonClickCallback = null;

  /**
   * @type { RouteModelDispatch }
   */
  #routeModelDispatch = null;

  /**
   * Presenter constructor
   * @param { RoutePointItemConstructorParams } presenterParams
   */
  constructor({ rootElement, routePoint, routeModelDispatch, onRollupClick, ...presenterParams }) {
    super(presenterParams);
    this.#rootElement = rootElement;
    this.#routePoint = routePoint;
    this.#routeModelDispatch = routeModelDispatch;
    this.#rollupButtonClickCallback = onRollupClick;
  }

  #asEventListItem(view) {
    if (view instanceof AbstractView) {
      const listItemView = new EventsListItemView();
      render(view, listItemView.element);
      return listItemView;
    }
  }

  /**
   * View render
   * @param { AbstractView } view
   */
  #renderView(view) {
    if (view instanceof AbstractView) {
      const listItemView = this.#asEventListItem(view);
      if (this.#itemView) {
        replace(listItemView, this.#itemView);
        remove(this.#itemView);
      } else {
        render(listItemView, this.#rootElement);
      }
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
  #deleteButtonClickHandler = (routePoint) => {
    this.#routeModelDispatch(
      UserActions.DELETE_POINT,
      ModelActions.MINOR_UPDATE,
      routePoint
    );
  };

  /**
   * Favorite change
   */
  #favoriteButtonClickHandler = () => {
    this.#routeModelDispatch(
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
  #editFormSubmitHandler = (routePointDto) => {
    this.#routeModelDispatch(
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
      getOffers: (eventType) => this._offerModel
        .getOffersByEventType(eventType)
        .map((current) => DataTransferObjectService.getOfferDto(current)),
      getDestinations: () => this._routeDestinationModel.data.map((current) => DataTransferObjectService.getDestinationDto(current)),
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
 * @typedef { import('../../shared/presenter').PresenterConstructorParams } PresenterConstructorParams
 */

/**
 * @typedef { Object } RoutePountPresenterAdditionalParams
 * @property { RoutePointDto } RoutePountPresenterAdditionalParams.routePoint
 * @property { HTMLElement } RoutePountPresenterAdditionalParams.rootElement
 * @property { () => void } RoutePountPresenterAdditionalParams.onRollupClick
 * @property { RouteModelDispatch } RoutePountPresenterAdditionalParams.routeModelDispatch
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
 * @callback RouteModelDispatch
 * @param { UserActions } userAction
 * @param { ModelActions } modelActionType
 * @param { RoutePointDto } data
 * @returns { void }
 */

/**
 * @typedef { PresenterConstructorParams & RoutePountPresenterAdditionalParams } RoutePointItemConstructorParams
 */
